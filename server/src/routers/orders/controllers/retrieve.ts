import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { OrdersInterface } from '../../../../../_shared/types';
import { generateKey } from '../../../../../_shared/utils';

export const retrieveCart = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { orderId } = req.query;

  if (req.session.user?.id) {
    let order = await database.retrieve<OrdersInterface[]>(
      `SELECT
        o.id,
        COALESCE(oi.items, '[]'::JSONB) AS items
      FROM orders AS o
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(oi.*) AS items
        FROM order_items AS oi
        WHERE oi.order_id = o.id
      ) AS oi ON true`,
      {
        where: `o.user_id = $1 AND o.status = $2 AND (o.updated_at IS NULL OR o.updated_at > NOW() - INTERVAL '1 hour')`,
        params: [req.session.user.id, 'draft'],
        client
      }
    );

    if (!order.length) {
      const id = generateKey(1);

      order = await database.create('orders', ['id', 'user_id'], [id, req.session.user.id], { client });
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
