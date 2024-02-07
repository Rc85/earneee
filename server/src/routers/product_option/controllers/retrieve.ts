import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveProductOption = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { variantId } = req.query;

  const options = await database.product.option.retrieve({
    where: 'po.variant_id = $1',
    params: [variantId],
    client
  });

  resp.locals.response = { data: { options } };

  return next();
};
