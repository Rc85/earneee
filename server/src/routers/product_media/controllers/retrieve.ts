import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';

export const retrieveProductMedia = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { productId } = req.query;
  const params = [productId];
  const where = [`product_id = $1`];

  const media = await database.retrieve('SELECT * FROM product_media', {
    where: where.join(' AND '),
    params,
    orderBy: 'ordinance',
    client
  });

  resp.locals.response = { data: { media } };

  return next();
};
