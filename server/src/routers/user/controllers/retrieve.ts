import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import {
  OrdersInterface,
  UserMessagesInterface,
  UserProfilesInterface,
  UsersInterface
} from '../../../../../_shared/types';

export const retrieveUserProfiles = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const offset = req.query.offset?.toString() || '0';
  const limit = req.query.limit?.toString() || undefined;
  const params = [];
  const where = [];
  const { userId } = req.query;

  if (userId) {
    params.push(userId);

    where.push(`up.id = $1`);
  }

  const userProfiles = await database.retrieve<UserProfilesInterface[]>(
    `SELECT
      up.id,
      up.first_name,
      up.last_name,
      up.phone_number,
      up.address,
      up.city,
      up.region,
      up.country,
      up.postal_code,
      up.logo_url,
      u.email
    FROM user_profiles AS up
    LEFT JOIN users AS u
    ON u.id = up.id`,
    {
      where: where.join(' AND '),
      params,
      offset,
      limit,
      orderBy: 'u.email',
      client
    }
  );

  const count = await database.retrieve<{ count: number }[]>('SELECT COUNT(*)::INT FROM user_profiles', {
    where: where.join(' AND '),
    params,
    client
  });

  resp.locals.response = { data: { userProfiles, count: count[0].count } };

  return next();
};

export const retrieveUsers = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const offset = req.query.offset?.toString() || '0';
  const limit = req.query.limit?.toString() || undefined;
  const emails = ['admin@earneee.com', 'roger@earneee.com'];

  const users = await database.retrieve<UsersInterface[]>(
    `WITH
    up AS (
      SELECT
        up.id,
        up.first_name,
        up.last_name,
        up.phone_number,
        up.address,
        up.city,
        up.region,
        up.country,
        up.postal_code,
        up.logo_url
      FROM user_profiles AS up
    ),
    ub AS (
      SELECT
        ub.id,
        ub.user_id,
        ub.banned_until,
        ub.reason
      FROM user_bans AS ub
      WHERE ub.banned_until > NOW()
      ORDER BY ub.banned_until DESC
      LIMIT 1
    )

    SELECT
      u.id,
      u.email,
      u.is_admin,
      u.status,
      u.created_at,
      up.profile,
      ub.ban
    FROM users AS u
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(up.*) AS profile
      FROM up
      WHERE up.id = u.id
    ) AS up ON true
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(ub.*) AS ban
      FROM ub
      WHERE ub.user_id = u.id
    ) AS ub ON true`,
    {
      where: 'NOT email = ANY($1)',
      params: [emails],
      offset,
      limit,
      orderBy: 'email',
      client
    }
  );
  const count = await database.retrieve<{ count: number }[]>('SELECT COUNT(*)::INT FROM users', {
    where: 'NOT email = ANY($1)',
    params: [emails],
    client
  });

  resp.locals.response = { data: { users, count: count[0].count } };

  return next();
};

export const retrieveUserProfile = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;

  if (req.session.user?.id) {
    const userProfile = await database.retrieve<UserProfilesInterface[]>('SELECT * FROM user_profiles', {
      where: 'id = $1',
      params: [req.session.user.id],
      client
    });

    resp.locals.response = { data: { userProfile: userProfile[0] } };
  }

  return next();
};

export const retrieveMessageCount = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;

  if (req.session.user?.id) {
    const count = await database.retrieve<{ count: number }[]>('SELECT COUNT(*)::INT FROM user_messages', {
      where: 'user_id = $1 AND status = $2',
      params: [req.session.user.id, 'new'],
      client
    });

    resp.locals.response = { data: { count: count[0].count } };
  }

  return next();
};

export const retrieveMessages = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const offset = req.query.offset?.toString() || '0';
  const limit = req.query.limit?.toString() || undefined;

  if (req.session.user?.id) {
    const messages = await database.retrieve<UserMessagesInterface[]>('SELECT * FROM user_messages', {
      where: 'user_id = $1 AND status = ANY($2)',
      offset,
      limit,
      orderBy: 'created_at DESC',
      params: [req.session.user.id, ['new', 'read']],
      client
    });

    const count = await database.retrieve<{ count: number }[]>('SELECT COUNT(*)::INT FROM user_messages', {
      where: 'user_id = $1 AND status = ANY($2)',
      params: [req.session.user.id, ['new', 'read']],
      client
    });

    resp.locals.response = { data: { messages, count: count[0].count } };
  }

  return next();
};

export const retrieveUserOrders = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const offset = req.query.offset?.toString() || '0';
  const limit = req.query.limit?.toString() || '20';

  if (req.session.user?.id) {
    const orders = await database.retrieve<OrdersInterface[]>(
      `SELECT
        o.id,
        o.number,
        o.status,
        o.created_at
      FROM orders AS o`,
      {
        where: `o.user_id = $1 AND o.status != $2`,
        params: [req.session.user.id, 'draft'],
        orderBy: 'o.created_at DESC',
        limit,
        offset,
        client
      }
    );

    const count = await database.retrieve<{ count: number }[]>(`SELECT COUNT(*)::INT FROM orders`, {
      where: 'user_id = $1 AND status != $2',
      params: [req.session.user.id, 'draft'],
      client
    });

    resp.locals.response = { data: { orders, count: count[0].count } };
  }

  return next();
};

export const retrieveUserOrder = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { orderId } = req.query;

  if (req.session.user?.id) {
    const order = await database.retrieve<OrdersInterface[]>(
      `WITH
      r AS (
        SELECT
          r.id,
          r.amount,
          r.quantity,
          r.order_item_id,
          r.reference,
          r.status
        FROM refunds AS r
      ),
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
          FROM r
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
      {
        where: 'o.user_id = $1 AND o.status != $2 AND o.id = $3',
        params: [req.session.user.id, 'draft', orderId],
        client
      }
    );

    resp.locals.response = { data: { order: order[0] } };
  }

  return next();
};
