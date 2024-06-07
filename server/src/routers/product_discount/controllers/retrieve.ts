import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { ProductDiscountsInterface } from '../../../../../_shared/types';

export const retrieveProductDiscounts = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { productId } = req.query;
  const offset = req.query.offset?.toString() || '0';

  const discounts = await database.retrieve<ProductDiscountsInterface[]>(`SELECT * FROM product_discounts`, {
    where: 'product_id = $1',
    params: [productId],
    orderBy: 'ends_at DESC',
    limit: '20',
    offset,
    client
  });

  const count = await database.retrieve<{ count: number }[]>('SELECT COUNT(*)::INT FROM product_discounts', {
    where: 'product_id = $1',
    params: [productId],
    client
  });

  resp.locals.response = { data: { discounts, count: count[0].count } };

  return next();
};
