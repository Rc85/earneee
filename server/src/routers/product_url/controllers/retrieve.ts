import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveProductUrl = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { variantId } = req.query;

  const urls = await database.retrieve('product_urls', {
    columns: 'id, url, country, variant_id',
    where: 'variant_id = $1',
    params: [variantId],
    client
  });

  resp.locals.response = { data: { urls } };

  return next();
};
