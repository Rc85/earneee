import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { ProductSpecificationsInterface } from '../../../../../_shared/types';

export const retrieveProductSpecification = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { productId } = req.query;
  const params = [productId];
  const where = [`ps.product_id = $1`];

  const specifications = await database.retrieve<ProductSpecificationsInterface[]>(
    `SELECT
      s.id,
      s.name,
      s.value,
      ps.product_id
    FROM specifications AS s
    LEFT JOIN product_specifications AS ps
    ON ps.specification_id = s.id`,
    { where: where.join(' AND '), params, orderBy: 's.ordinance, s.name', client }
  );

  resp.locals.response = { data: { specifications } };

  return next();
};

export const retrieveMarketplaceProductSpecifications = async (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  const { client } = resp.locals;
  const { categoryId } = req.query;

  const specifications = await database.retrieve<ProductSpecificationsInterface[]>(
    `WITH RECURSIVE
    p AS (
      SELECT
        id,
        name,
        parent_id
      FROM categories
      WHERE id = $1
      UNION ALL
      SELECT
        c.id,
        c.name,
        c.parent_id
      FROM categories AS c
      JOIN p ON p.id = c.parent_id
    )
    
    SELECT
      s.id,
      s.name,
      s.value
    FROM specifications AS s
    LEFT JOIN product_specifications AS ps
    ON ps.specification_id = s.id
    LEFT JOIN products AS prd
    ON ps.product_id = prd.id`,
    {
      where: `prd.category_id IN (SELECT id FROM p) AND prd.parent_id IS null AND prd.published IS true`,
      orderBy: `s.ordinance, s.name`,
      params: [categoryId],
      client
    }
  );
  resp.locals.response = { data: { specifications } };
  return next();
};
