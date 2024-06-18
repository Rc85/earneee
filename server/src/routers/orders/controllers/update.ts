import { NextFunction, Request, Response } from 'express';
import { stripe } from '../../../services';
import { database } from '../../../middlewares';
import { OrdersInterface } from '../../../../../_shared/types';
import Stripe from 'stripe';
import { generateKey } from '../../../../../_shared/utils';

export const checkout = async (req: Request, resp: Response, next: NextFunction) => {
  const { client, order } = resp.locals;
  const { cancelUrl } = req.body;

  if (req.session.user?.id && order) {
    if (order.sessionId) {
      await stripe.checkout.sessions.retrieve(order.sessionId);
    }

    const orderItems = [];

    for (const item of order.items) {
      const price = await stripe.prices.create({
        currency: item.product.url?.currency || 'cad',
        unit_amount: Math.round(item.price * 100),
        metadata: {
          order_item_id: item.id
        },
        tax_behavior: 'exclusive',
        product_data: {
          name: item.name
        }
      });

      orderItems.push({ ...item, priceId: price.id });
    }

    const session = await stripe.checkout.sessions.create({
      line_items: orderItems.map((item) => ({
        price: item.priceId,
        quantity: item.quantity
      })),
      automatic_tax: {
        enabled: true
      },
      shipping_address_collection: {
        allowed_countries: ['CA', 'US']
      },
      metadata: {
        order_id: order.id
      },
      mode: 'payment',
      success_url: `http://localhost:3000/checkout/success`,
      cancel_url: `http://localhost:3000${cancelUrl}`
    });

    await database.update('orders', ['session_id'], {
      where: 'id = $2',
      params: [session.id, order.id],
      client
    });

    resp.locals.response = { data: { url: session.url } };
  }

  return next();
};

export const updateOrder = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { order } = req.body;

  await database.update('orders', ['status'], { where: 'id = $2', params: [order.status, order.id], client });

  await database.update('order_items', ['status'], {
    where: 'order_id = $2',
    params: ['delivered', order.id],
    client
  });

  resp.locals.response = { data: { statusText: 'Order updated' } };

  next();
};

export const updateOrderItem = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { orderItem } = req.body;

  await database.update('order_items', ['status'], {
    where: 'id = $2',
    params: [orderItem.status, orderItem.id],
    client
  });

  return next();
};

export const refundOrderItem = async (req: Request, resp: Response, next: NextFunction) => {
  const { client, lineItem, order } = resp.locals;
  const { quantity, orderItemId, reason } = req.body;

  const itemPrice = lineItem?.price?.unit_amount || 0;
  const itemTax = (lineItem?.amount_tax || 0) / (lineItem?.quantity || 1);

  if (order?.sessionId) {
    const checkoutSession = await stripe.checkout.sessions.retrieve(order.sessionId);

    if (checkoutSession) {
      const refundObj: Stripe.RefundCreateParams = {
        amount: (itemPrice + itemTax) * quantity,
        metadata: {
          order_item_id: orderItemId
        }
      };

      if (checkoutSession.payment_intent) {
        refundObj.payment_intent = checkoutSession.payment_intent as string;
      }

      if (reason) {
        refundObj.reason = reason;
      }

      const refund = await stripe.refunds.create(refundObj);
      const id = generateKey(1);
      const amount = (itemPrice + itemTax) / 100;

      await database.create(
        'refunds',
        ['id', 'order_item_id', 'amount', 'refund_id', 'reason', 'quantity', 'status'],
        [id, orderItemId, amount, refund.id, reason, quantity, 'complete'],
        { client }
      );

      resp.locals.response = { data: { statusText: 'Refund issued' } };
    }
  }

  return next();
};
