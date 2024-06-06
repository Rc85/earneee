import { NextFunction, Request, Response } from 'express';
import { database } from '../../../../src/middlewares/database';

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
