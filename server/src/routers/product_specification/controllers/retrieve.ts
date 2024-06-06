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
