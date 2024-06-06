import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { StatusesInterface } from '../../../../../_shared/types';

export const retrieveStatuses = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { name } = req.query;
  const where = [];
  const params = [];

  if (name) {
    params.push(name);

    where.push(`name = $${params.length}`);
  }

  const statuses = await database.retrieve<StatusesInterface[]>(`SELECT id, name, online FROM statuses`, {
    where: where.join(' AND '),
    params,
    orderBy: 'name',
    client
  });

  resp.locals.response = { data: { statuses } };

  return next();
};
