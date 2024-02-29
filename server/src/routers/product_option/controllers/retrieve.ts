import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveProductOption = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { variantId, productId } = req.query;
  const params = [productId];
  const where = [`po.product_id = $1`];

  if (variantId) {
    params.push(variantId);

    where.push(`po.variant_id = $${params.length}`);
  } else {
    where.push(`po.variant_id IS NULL`);
  }

  const options = await database.product.option.retrieve({
    where: where.join(' AND '),
    params,
    client
  });

  resp.locals.response = { data: { options } };

  return next();
};
