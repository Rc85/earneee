import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';

export const sortProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { products } = req.body;

  if (products) {
    for (const index in products) {
      const product = products[index];
      const ordinance = parseInt(index) + 1;

      await database.update('products', ['ordinance'], {
        where: 'id = $2',
        params: [ordinance, product.id],
        client
      });
    }
  }

  return next();
};
