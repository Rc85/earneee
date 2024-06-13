import { NextFunction, Request, Response } from 'express';
import { stripe } from '../../../services';
import { database } from '../../../middlewares';

export const checkout = async (req: Request, resp: Response, next: NextFunction) => {
  const { client, order } = resp.locals;
  const { cancelUrl } = req.body;

  if (req.session.user?.id && order) {
    if (order.sessionId) {
      await stripe.checkout.sessions.retrieve(order.sessionId);
    }

    const session = await stripe.checkout.sessions.create({
      line_items: order.items.map((item) => ({
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.name
          },
          tax_behavior: 'exclusive',
          unit_amount: Math.round(item.price * 100)
        },
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
