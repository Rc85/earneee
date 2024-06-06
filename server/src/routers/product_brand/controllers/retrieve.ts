import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { ProductBrandsInterface } from '../../../../../_shared/types';

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

  const brands = await database.retrieve<ProductBrandsInterface[]>(
    `SELECT
      pb.id,
      pb.name,
      pb.url,
      pb.logo_url,
      pb.logo_path,
      pb.status,
      pb.owner
    FROM product_brands AS pb`,
    { where: where.join(' AND '), params, limit: '20', offset, orderBy: 'pb.name', client }
  );

  const count = await database.retrieve<{ count: number }[]>('SELECT COUNT(*)::INT FROM product_brands', {
    where: where.join(' AND '),
    params,
    client
  });

  resp.locals.response = { data: { brands, count: count[0].count } };

  return next();
};
