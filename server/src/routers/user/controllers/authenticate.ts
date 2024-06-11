import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { SessionsInterface } from '../../../../../_shared/types';
import { sendEmail } from '../../../services';
import { v4 as uuidv4 } from 'uuid';

export const authenticate = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.session.user?.id) {
    resp.locals.response = { status: 200, data: { user: req.session.user } };
  }

  return next();
};

export const login = async (req: Request, resp: Response, next: NextFunction) => {
  const { client, user } = resp.locals;
  const { remember, application } = req.body;

  if (user) {
    if (user.status === 'inactive') {
      const updatedUser = await database.update('users', ['created_at', 'confirmation_key'], {
        where: 'id = $3',
        params: [new Date(), uuidv4(), user.id],
        client
      });

      await sendEmail.newAccount.send(updatedUser[0].email, updatedUser[0].confirmationKey);

      resp.locals.response = { status: 202 };
    } else {
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
  }

  return next();
};

export const logout = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;

  if (req.session.user?.id) {
    await database.update('sessions', ['status'], {
      where: 'id = $2',
      params: ['terminated', `sess:${req.session.id}`],
      client
    });

    req.session.destroy();
  }

  return next();
};
