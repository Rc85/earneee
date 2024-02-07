import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveProductSpecification = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { variantId } = req.query;

  const specifications = await database.retrieve('product_specifications', {
    where: 'variant_id = $1',
    params: [variantId],
    client
  });

  resp.locals.response = { data: { specifications } };

  return next();
};
