import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const deleteProductSpecification = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { specificationId } = req.query;

  await database.delete('product_specifications', { where: 'id = $1', params: [specificationId], client });

  return next();
};
