import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';

export const updateProductSpecification = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { specification } = req.body;

  if (specification) {
    await database.update('specifications', ['name', 'value'], {
      where: `id = $3`,
      params: [specification.name, specification.value, specification.id],
      client
    });
  }

  return next();
};
