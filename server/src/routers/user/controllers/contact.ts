import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const contact = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { name, email, message } = req.body;

  await database.create('feedback', ['name', 'email', 'message'], [name, email, message], { client });

  resp.locals.response = { data: { statusText: 'Message received' } };

  return next();
};
