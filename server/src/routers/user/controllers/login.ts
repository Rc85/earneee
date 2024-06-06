import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { SessionsInterface } from '../../../../../_shared/types';

export const login = async (req: Request, resp: Response, next: NextFunction) => {
  const { client, user } = resp.locals;
  const { remember, application } = req.body;

  if (user) {
    const ipAddress = req.headers['real-x-ip'] || '127.0.0.1';

    const activeSession = await database.retrieve<SessionsInterface[]>('SELECT * FROM sessions', {
      where: 'user_id = $1 AND application = $2 AND status = $3',
      params: [user.id, application, 'active'],
      client
    });

    if (activeSession.length === 1 && activeSession[0].ipAddress !== ipAddress) {
      // send email
    }

    req.session.user = { id: user.id, email: user.email, isAdmin: user.isAdmin, country: user.country };

    const expireAt = remember ? new Date('2100-12-31') : new Date(new Date().getTime() + 60000 * 60 * 24);

    if (remember) {
      req.session.cookie.maxAge = expireAt.getTime();
    }

    await database.create(
      'sessions',
      ['id', 'user_id', 'ip_address', 'application', 'status'],
      [`sess:${req.session.id}`, user.id, ipAddress, application, 'active'],
      {
        conflict: {
          columns: 'id',
          do: `UPDATE SET updated_at = NOW()`
        },
        client
      }
    );
  }

  return next();
};
