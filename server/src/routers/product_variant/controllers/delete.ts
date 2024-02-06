import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const deleteVariant = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { variantId } = req.query;

  await database.delete('product_variants', { where: 'id = $1', params: [variantId], client });

  return next();
};
