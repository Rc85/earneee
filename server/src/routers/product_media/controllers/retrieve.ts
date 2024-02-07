import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveProductMedia = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { variantId } = req.query;

  const media = await database.retrieve('product_media', {
    where: 'variant_id = $1',
    params: [variantId],
    client
  });

  resp.locals.response = { data: { media } };

  return next();
};
