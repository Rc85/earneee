import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';

export const deleteProductDiscount = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id } = req.query;

  await database.delete('product_discounts', { where: 'id = $1', params: [id], client });

  return next();
};
