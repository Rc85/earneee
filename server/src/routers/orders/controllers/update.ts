import { NextFunction, Request, Response } from 'express';
import { s3, stripe } from '../../../services';
import { database } from '../../../middlewares';
import { OrderItemsInterface, OrdersInterface } from '../../../../../_shared/types';
import Stripe from 'stripe';
import { generateKey } from '../../../../../_shared/utils';
import { ObjectCannedACL } from '@aws-sdk/client-s3';

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
        ['id', 'order_item_id', 'amount', 'refund_id', 'reason', 'quantity'],
        [id, orderItemId, amount, refund.id, reason, quantity],
        { client }
      );

      resp.locals.response = { data: { statusText: 'Refund issued' } };
    }
  }

  return next();
};

export const updateRefund = async (req: Request, resp: Response, next: NextFunction) => {
  const { client, refund } = resp.locals;
  const { status } = req.body;

  if (refund) {
    if (status === 'complete') {
      const orderItem = await database.retrieve<OrderItemsInterface[]>(`SELECT * FROM order_items`, {
        where: 'id = $1',
        params: [refund?.orderItemId],
        client
      });
      const order = await database.retrieve<OrdersInterface[]>(`SELECT * FROM orders`, {
        where: 'id = $1',
        params: [orderItem[0]?.orderId],
        client
      });

      if (order.length && order[0].sessionId) {
        const checkoutSession = await stripe.checkout.sessions.retrieve(order[0].sessionId);

        if (checkoutSession?.payment_intent) {
          const stripeRefund = await stripe.refunds.create({
            payment_intent: checkoutSession.payment_intent as string,
            amount: Math.round(refund.amount * 100),
            metadata: {
              order_item_id: refund.orderItemId
            },
            reason: 'requested_by_customer'
          });

          await database.update('refunds', ['refund_id'], {
            where: 'id = $2',
            params: [stripeRefund.id, refund.id],
            client
          });
        }
      }
    } else if (status === 'declined') {
      await database.update('refunds', ['status'], {
        where: `id = $2`,
        params: ['declined', refund.id],
        client
      });
    }
  }

  return next();
};

export const updateRefundNotes = async (req: Request, resp: Response, next: NextFunction) => {
  const { client, refund } = resp.locals;
  const { notes } = req.body;

  if (refund) {
    await database.update('refunds', ['notes'], {
      where: 'id = $2',
      params: [notes || null, refund.id],
      client
    });
  }

  return next();
};

export const uploadRefundPhotos = async (req: Request, resp: Response, next: NextFunction) => {
  const { client, refund } = resp.locals;
  const { photos } = req.body;

  if (photos && refund) {
    for (const photo of photos) {
      const base64 = photo.split(',')[1];
      const extension = photo.split(',')[0].split('/')[1].split(';')[0];
      const buffer = Buffer.from(base64, 'base64');

      const key = `refunds/${refund.id}/${Date.now()}.${extension}`;
      const params = {
        Body: buffer,
        Bucket: process.env.S3_BUCKET_NAME || '',
        Key: key,
        ACL: 'public-read' as ObjectCannedACL,
        CacheControl: 'max-age=604800',
        ContentType: 'image/jpeg'
      };

      await s3.putObject(params);
      const url = `https://${process.env.S3_BUCKET_NAME}.${
        process.env.S3_ENDPOINT
      }/${key}?ETag=${Date.now()}`;

      await database.create('refund_photos', ['url', 'path', 'refund_id'], [url, key, refund.id], {
        client
      });
    }
  }

  return next();
};
