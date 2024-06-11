import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';

export const activateAccount = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { key } = req.body;

  await database.update('users', ['status'], {
    where: 'confirmation_key = $2',
    params: ['active', key],
    client
  });

  return next();
};
