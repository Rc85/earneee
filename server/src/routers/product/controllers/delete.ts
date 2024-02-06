import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const deleteProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { productId } = req.query;

  await database.delete('products', { where: 'id = $1', params: [productId], client });

  return next();
};
