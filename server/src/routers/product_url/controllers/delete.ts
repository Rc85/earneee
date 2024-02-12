import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const deleteProductUrl = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { urlId } = req.query;

  await database.delete('product_urls', { where: 'id = $1', params: [urlId], client });

  return next();
};
