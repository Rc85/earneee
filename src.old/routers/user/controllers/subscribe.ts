import { NextFunction, Request, Response } from 'express';
import { database } from '../../../../src/middlewares/database';

export const subscribe = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { email } = req.body;

  await database.create('subscribers', ['email'], [email], {
    conflict: { columns: 'email', do: `NOTHING` },
    client
  });

  resp.locals.response = { data: { statusText: 'Thank you for subscribing' } };

  return next();
};
