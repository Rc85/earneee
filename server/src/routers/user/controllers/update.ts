import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';
import dayjs from 'dayjs';

export const updateUser = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, bannedUntil, reason, status, unban } = req.body;

  if (reason && bannedUntil) {
    await database.create('user_bans', ['user_id', 'banned_until', 'reason'], [id, bannedUntil, reason], {
      client
    });
  } else if (unban) {
    const ban = await database.retrieve('user_bans', {
      where: 'user_id = $1 AND banned_until > NOW()',
      orderBy: 'banned_until DESC',
      limit: '1',
      params: [id],
      client
    });

    if (ban.length) {
      await database.update('user_bans', ['banned_until'], {
        where: `id = $2`,
        params: [dayjs().subtract(1, 'hour').toDate(), ban[0].id],
        client
      });
    }
  }

  if (status) {
    await database.update('users', ['status'], { where: `id = $2`, params: [status, id], client });
  }

  return next();
};
