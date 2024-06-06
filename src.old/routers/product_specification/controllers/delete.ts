import { NextFunction, Request, Response } from 'express';
import { database } from '../../../../src/middlewares/database';

export const deleteProductSpecification = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { specificationId } = req.query;

  await database.delete('specifications', { where: 'id = $1', params: [specificationId], client });

  return next();
};
