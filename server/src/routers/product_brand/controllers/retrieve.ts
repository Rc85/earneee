import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveProductBrands = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const offset = req.query.offset?.toString() || '0';
  const { brandId } = req.query;
  const params = [];
  const where = [];

  if (brandId) {
    params.push(brandId);

    where.push(`id = $1`);
  }

  const brands = await database.product.brand.retrieve({
    where: where.join(' AND '),
    params,
    limit: '20',
    offset,
    orderBy: 'pb.name',
    client
  });

  const count = await database.count('product_brands', { where: where.join(' AND '), params, client });

  resp.locals.response = { data: { brands, count } };

  return next();
};
