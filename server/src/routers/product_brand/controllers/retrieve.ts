import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { ProductBrandsInterface, UserProfilesInterface } from '../../../../../_shared/types';

export const retrieveProductBrands = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const offset = req.query.offset?.toString() || '0';
  const { brandId } = req.query;
  const params = [];
  const where = [];

  if (brandId) {
    params.push(brandId);

    where.push(`pb.id = $1`);
  }

  const brands = await database.retrieve<ProductBrandsInterface[]>(
    `SELECT
      pb.id,
      pb.name,
      pb.url,
      pb.logo_url,
      pb.logo_path,
      pb.status,
      u.email AS owner
    FROM product_brands AS pb
    LEFT JOIN users AS u
    ON u.id = pb.owner`,
    { where: where.join(' AND '), params, limit: '20', offset, orderBy: 'pb.name', client }
  );

  const count = await database.retrieve<{ count: number }[]>(
    'SELECT COUNT(*)::INT FROM product_brands AS pb',
    {
      where: where.join(' AND '),
      params,
      client
    }
  );

  resp.locals.response = { data: { brands, count: count[0].count } };

  return next();
};

export const retrieveBrandOnwers = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { email } = req.query;

  if (email) {
    const owners = await database.retrieve<UserProfilesInterface[]>(`SELECT u.email FROM users AS u`, {
      where: `u.email ILIKE $1 AND NOT u.email = ANY($2)`,
      params: [`%${email}%`, [`admin@earneee.com`]],
      orderBy: 'u.email',
      client
    });

    resp.locals.response = { data: { owners } };
  }

  return next();
};
