import { NextFunction, Request, Response } from 'express';
import { database } from '../../../../src/middlewares/database';
import bcrypt from 'bcrypt';

export const changePassword = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { newPassword } = req.body;

  if (req.session.user?.id) {
    const hashed = await bcrypt.hash(newPassword, 10);

    await database.update('users', ['password'], {
      where: 'id = $2',
      params: [hashed, req.session.user.id],
      client
    });

    await database.update('sessions', ['status'], {
      where: 'id = $2',
      params: ['terminated', `sess:${req.session.id}`],
      client
    });

    req.session.destroy();

    resp.locals.response = { status: 200, data: { statusText: 'Password changed' } };
  }

  return next();
};
