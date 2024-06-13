import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { OrdersInterface } from '../../../../../_shared/types';
import { generateKey } from '../../../../../_shared/utils';
import dayjs from 'dayjs';
import { stripe } from '../../../services';
import { generateOrderNumber } from '../../../utils';

export const retrieveCart = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;

  if (req.session.user?.id) {
    let order = await database.retrieve<OrdersInterface[]>(
      `SELECT
        o.id,
        o.number,
        COALESCE(oi.items, '[]'::JSONB) AS items
      FROM orders AS o
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(oi.*) AS items
        FROM order_items AS oi
        WHERE oi.order_id = o.id
      ) AS oi ON true`,
      {
        where: `o.user_id = $1 AND o.status = $2`,
        params: [req.session.user.id, 'draft'],
        client
      }
    );

    if (
      !order.length ||
      (order[0].updatedAt && dayjs().diff(dayjs(order[0].updatedAt), 'hour') > 1) ||
      dayjs().diff(dayjs(order[0].createdAt), 'hour') > 1
    ) {
      if (order.length && order[0].sessionId) {
        await stripe.checkout.sessions.expire(order[0].sessionId);
      }

      const id = generateKey(1);
      const orderNumber = await generateOrderNumber(req.session.user.id, client);

      order = await database.create(
        'orders',
        ['id', 'user_id', 'number'],
        [id, req.session.user.id, orderNumber],
        { client }
      );
    } else {
      await database.update('orders', '', {
        where: 'id = $1',
        params: [order[0].id],
        client
      });
    }

    order = await database.retrieve<OrdersInterface[]>(
      `SELECT
        o.id,
        o.number,
        COALESCE(oi.items, '[]'::JSONB) AS items
      FROM orders AS o
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(oi.*) AS items
        FROM order_items AS oi
        WHERE oi.order_id = o.id
      ) AS oi ON true`,
      {
        where: `o.id = $1 AND o.status = $2`,
        params: [order[0].id, 'draft'],
        client
      }
    );

    resp.locals.response = { data: { order: order[0] } };
  }

  return next();
};
