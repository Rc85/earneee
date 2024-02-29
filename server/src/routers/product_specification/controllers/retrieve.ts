import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveProductSpecification = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { variantId, categoryId, productId } = req.query;
  const params = [productId];
  const where = [`ps.product_id = $1`];

  if (variantId) {
    params.push(variantId);

    where.push(`ps.variant_id = $${params.length}`);
  } else {
    where.push(`ps.variant_id IS NULL`);
  }

  if (categoryId) {
    params.push(categoryId);

    where.push(`prd.category_id IN (SELECT id FROM p)`);
  }

  const specifications = await database.query(
    `WITH RECURSIVE
    p AS (
      SELECT
        id,
        name,
        parent_id
      FROM categories
      ${variantId && categoryId ? 'WHERE id = $2' : categoryId ? 'WHERE id = $1' : ''}
      UNION ALL
      SELECT
        c.id,
        c.name,
        c.parent_id
      FROM categories AS c
      JOIN p ON p.id = c.parent_id
    ),
    pr AS (
      SELECT
        pr.id,
        pr.name,
        pr.category_id
      FROM products AS pr
    )
    
    SELECT
      s.id,
      s.name,
      s.value
    FROM specifications AS s
    LEFT JOIN product_specifications AS ps
    ON ps.specification_id = s.id
    LEFT JOIN product_variants AS pv
    ON ps.variant_id = pv.id
    LEFT JOIN products AS prd
    ON pv.product_id = prd.id
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY s.ordinance, s.name`,
    params,
    client
  );

  resp.locals.response = { data: { specifications } };

  return next();
};
