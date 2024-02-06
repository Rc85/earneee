import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const offset = req.query.offset?.toString() || '0';
  const { productId } = req.query;
  const params = [];
  const where = [];

  if (productId) {
    params.push(productId);

    where.push(`p.id = $1`);
  }

  const products = await database.product.retrieve({
    where: where.join(' AND '),
    params,
    limit: '20',
    orderBy: 'p.name',
    offset,
    client
  });

  const count = await database.count('products AS p', { where: where.join(' AND '), params, client });

  resp.locals.response = { data: { products, count } };

  return next();
};
