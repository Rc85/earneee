import { NextFunction, Request, Response } from 'express';
import { stripe } from '../../services';
import { HttpException } from '../../utils';
import { database } from '../../middlewares';
import Stripe from 'stripe';

export const checkoutWebhook = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const sig = req.headers['stripe-signature'] as string | string[] | Buffer;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_CHECKOUT_WEBHOOK_KEY!);
  } catch (err: any) {
    throw new HttpException(400, `Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const checkout = event.data.object;
    const orderId = checkout.metadata?.order_id;

    if (orderId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(checkout.payment_intent as string, {
        expand: ['latest_charge']
      });
      const latestCharge = paymentIntent.latest_charge as Stripe.Charge;

      await database.update('orders', ['status', 'receipt_url'], {
        where: 'id = $3',
        params: ['processed', latestCharge.receipt_url, orderId],
        client
      });

      await database.update('order_items', ['status'], {
        where: 'order_id = $2',
        params: ['processed', orderId],
        client
      });
    }
  }

  return next();
};
