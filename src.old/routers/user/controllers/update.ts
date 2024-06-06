import { NextFunction, Request, Response } from 'express';
import { database } from '../../../../src/middlewares/database';
import dayjs from 'dayjs';

export const updateUser = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, bannedUntil, reason, status, unban, isAdmin } = req.body;

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

  if (status || typeof isAdmin === 'boolean') {
    const columns = [];
    const params = [];

    if (status) {
      params.push(status);
      columns.push(`status = $${params.length}`);
    }

    if (typeof isAdmin === 'boolean') {
      params.push(isAdmin);
      columns.push(`is_admin = $${params.length}`);
    }

    params.push(id);

    await database.update('users', columns.join(', '), { where: `id = $${params.length}`, params, client });
  }

  return next();
};
