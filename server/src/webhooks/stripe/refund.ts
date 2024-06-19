import { NextFunction, Request, Response } from 'express';
import { stripe } from '../../services';
import { HttpException } from '../../utils';
import { database } from '../../middlewares';
import { OrdersInterface } from '../../../../_shared/types';
import Stripe from 'stripe';

export const refundWebhook = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const sig = req.headers['stripe-signature'] as string | string[] | Buffer;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_REFUND_WEBHOOK_KEY!);
  } catch (err: any) {
    throw new HttpException(400, `Webhook error: ${err.message}`);
  }

  if (event.type === 'charge.refund.updated') {
    const refund = event.data.object;
    const order = await database.retrieve<OrdersInterface[]>(`SELECT * FROM orders`, {
      where: `id = $1`,
      params: [refund.metadata?.order_id],
      client
    });

    if (refund.status === 'failed') {
      await database.update('refunds', ['failure_reason', 'status'], {
        where: 'refund_id = $3',
        params: [refund.failure_reason, 'failed', refund.id],
        client
      });

      if (order.length) {
        await database.create(
          'user_messages',
          ['user_id', 'type', 'message'],
          [
            order[0].userId,
            'notification',
            `A refund has failed (Order ${order[0].number}). Please go see the order details for more information.`
          ],
          { client }
        );
      }
    } else if (refund.status === 'succeeded') {
      await database.update('refunds', ['reference', 'status'], {
        where: 'refund_id = $3',
        params: [refund.destination_details?.card?.reference, 'complete', refund.id],
        client
      });

      if (order.length) {
        const stripeRefund = await stripe.refunds.retrieve(refund.id, {
          expand: ['payment_intent.payment_method']
        });

        if (stripeRefund) {
          const paymentIntent = stripeRefund.payment_intent as Stripe.PaymentIntent;
          const paymentMethod = paymentIntent.payment_method as Stripe.PaymentMethod;

          await database.create(
            'user_messages',
            ['user_id', 'type', 'message'],
            [
              order[0].userId,
              'notification',
              `A refund of $${refund.amount / 100} has been issued to card ending in ${
                paymentMethod.card?.last4
              } (Order ${order[0].number}).`
            ],
            { client }
          );
        }
      }
    }
  }

  return next();
};
