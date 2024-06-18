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
        o.created_at,
        o.updated_at,
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

    if (order.length) {
      console.log(order[0].id);
      console.log('updated at diff', order[0].updatedAt, dayjs().diff(dayjs(order[0].updatedAt), 'hour'));
      console.log('created at diff', order[0].createdAt, dayjs().diff(dayjs(order[0].createdAt), 'hour'));
    }

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

export const listOrders = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const offset = req.query.offset?.toString() || '0';
  const limit = req.query.limit?.toString() || '20';

  const orders = await database.retrieve<OrdersInterface[]>(`SELECT o.* FROM orders AS o`, {
    where: 'status != $1',
    params: ['draft'],
    offset,
    limit,
    orderBy: 'created_at DESC',
    client
  });

  const count = await database.retrieve<{ count: number }[]>(`SELECT COUNT(o.*)::INT FROM orders AS o`, {
    where: 'status = $1',
    params: ['draft'],
    client
  });

  resp.locals.response = { data: { orders, count: count[0].count } };

  return next();
};

export const retrieveOrder = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { orderId } = req.query;

  const order = await database.retrieve<OrdersInterface[]>(
    `WITH
    oi AS (
      SELECT
        oi.*,
        os.shipment,
        COALESCE(r.refunds, '[]'::JSONB) AS refunds
      FROM order_items AS oi
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(os.*) AS shipment
        FROM order_shipments AS os
        WHERE os.id = oi.order_shipment_id
      ) AS os ON true
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(r.*) AS refunds
        FROM refunds AS r
        WHERE r.order_item_id = oi.id
      ) AS r ON true
    )
    
    SELECT
      o.*,
      COALESCE(oi.items, '[]'::JSONB) AS items
    FROM orders AS o
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(oi.*) AS items
      FROM oi
      WHERE oi.order_id = o.id
    ) AS oi ON true`,
    { where: `o.id = $1`, params: [orderId], client }
  );

  if (order.length && order[0].sessionId) {
    const checkoutSession = await stripe.checkout.sessions.retrieve(order[0].sessionId, {
      expand: ['payment_intent.latest_charge.balance_transaction', 'payment_intent.payment_method']
    });

    order[0].details = checkoutSession;
  }

  resp.locals.response = { data: { order: order[0] } };

  return next();
};
