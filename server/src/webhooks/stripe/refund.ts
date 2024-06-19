import { NextFunction, Request, Response } from 'express';
import { stripe } from '../../services';
import { HttpException } from '../../utils';
import { database } from '../../middlewares';

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

    console.log('refund', refund);

    if (refund.status === 'failed') {
      await database.update('refunds', ['failure_reason', 'status'], {
        where: 'refund_id = $3',
        params: [refund.failure_reason, 'failed', refund.id],
        client
      });
    } else if (refund.status === 'succeeded') {
      await database.update('refunds', ['reference', 'status'], {
        where: 'refund_id = $3',
        params: [refund.destination_details?.card?.reference, 'complete', refund.id],
        client
      });
    }
  }

  return next();
};
