import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const deleteCategory = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { categoryId } = req.query;

  await database.delete('categories', { where: 'id = $1', params: [categoryId], client });

  return next();
};
