import { NextFunction, Request, Response } from 'express';
import { database } from '../../../../src/middlewares/database';

export const sortVariants = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { variants } = req.body;

  if (variants) {
    for (const index in variants) {
      const ordinance = parseInt(index) + 1;
      const variant = variants[index];

      await database.update('product_variants', ['ordinance'], {
        where: 'id = $2',
        params: [ordinance, variant.id],
        client
      });
    }
  }

  return next();
};
