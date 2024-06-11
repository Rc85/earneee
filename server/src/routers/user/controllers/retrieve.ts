import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { UserProfilesInterface, UsersInterface } from '../../../../../_shared/types';

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
