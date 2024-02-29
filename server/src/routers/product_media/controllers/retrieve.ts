import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveProductMedia = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { variantId, productId } = req.query;
  const params = [productId];
  const where = [`product_id = $1`];

  if (variantId) {
    params.push(variantId);

    where.push(`variant_id = $${params.length}`);
  } else {
    where.push(`variant_id IS NULL`);
  }

  const media = await database.retrieve('product_media', {
    where: where.join(' AND '),
    params,
    orderBy: 'ordinance',
    client
  });

  resp.locals.response = { data: { media } };

  return next();
};
