import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const createStatus = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { name, online } = req.body.status;

  await database.create('statuses', ['name', 'online'], [name, online], {
    conflict: { columns: 'name', do: `UPDATE SET online = EXCLUDED.online, updated_at = NOW()` },
    client
  });

  return next();
};
