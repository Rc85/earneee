import { NextFunction, Request, Response } from 'express';
import { stripe } from '../../services';
import { HttpException } from '../../utils';
import { database } from '../../middlewares';
import util from 'util';

export const checkoutWebhook = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const sig = req.headers['stripe-signature'] as string | string[] | Buffer;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_CHECKOUT_WEBHOOK_KEY!);
  } catch (err: any) {
    throw new HttpException(400, `Webhook error: ${err.message}`);
  }

  console.log(util.inspect(event, { showHidden: false, depth: null, colors: true }));

  if (event.type === 'checkout.session.completed') {
    const orderId = event.data.object.metadata?.order_id;

    if (orderId) {
      await database.update('orders', ['status'], {
        where: 'id = $2',
        params: ['processed', orderId],
        client
      });
    }
  } else if (event.type === 'checkout.session.expired') {
    const orderId = event.data.object.metadata?.order_id;

    await database.update('orders', ['session_id'], { where: 'id = $2', params: [null, orderId], client });
  }

  return next();
};
