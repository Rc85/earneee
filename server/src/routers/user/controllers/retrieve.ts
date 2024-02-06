import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

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

  const userProfiles = await database.user.profile.retrieve({
    where: where.join(' AND '),
    params,
    offset,
    limit,
    orderBy: 'u.email',
    client
  });

  const count = await database.count('user_profiles', { where: where.join(' AND '), params, client });

  resp.locals.response = { data: { userProfiles, count } };

  return next();
};
