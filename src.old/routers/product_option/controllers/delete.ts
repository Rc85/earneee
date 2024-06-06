import { NextFunction, Request, Response } from 'express';
import { database } from '../../../../src/middlewares/database';

export const deleteProductOption = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { optionId } = req.query;

  await database.delete('product_options', { where: 'id = $1', params: [optionId], client });

  return next();
};
