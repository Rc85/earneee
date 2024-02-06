import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveCategories = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const where = [];
  const params = [];

  if (req.query.parentId) {
    params.push(req.query.parentId);

    where.push(`c.parent_id = $1`);
  } else {
    where.push(`c.parent_id IS NULL`);
  }

  const categories = await database.category.retrieve({
    where: where.join(' AND '),
    params,
    orderBy: 'c.ordinance',
    client
  });

  resp.locals.response = { data: { categories } };

  return next();
};
