import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const updateProductMedia = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, status } = req.body;

  await database.update('product_media', ['status'], { where: 'id = $2', params: [status, id], client });

  return next();
};
