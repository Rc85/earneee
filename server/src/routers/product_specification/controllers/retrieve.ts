import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveProductSpecification = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { productId, variantId } = req.query;
  const params = [productId];
  const where = [`ps.product_id = $1`];

  if (variantId) {
    params.push(variantId);

    where.push(`ps.variant_id = $${params.length}`);
  } else {
    where.push(`ps.variant_id IS NULL`);
  }

  const specifications = await database.query(
    `SELECT
      s.id,
      s.name,
      s.value
    FROM specifications AS s
    LEFT JOIN product_specifications AS ps
    ON ps.specification_id = s.id
    LEFT JOIN product_variants AS pv
    ON ps.variant_id = pv.id
    LEFT JOIN products AS prd
    ON ps.product_id = prd.id
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY s.ordinance, s.name`,
    params,
    client
  );

  resp.locals.response = { data: { specifications } };

  return next();
};
