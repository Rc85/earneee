import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';

export const sortCategories = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { categories } = req.body;

  console.log('categories', categories);

  if (categories) {
    for (const index in categories) {
      const ordinance = parseInt(index) + 1;
      const category = categories[index];

      await database.update('categories', ['ordinance'], {
        where: 'id = $2',
        params: [ordinance, category.id],
        client
      });
    }
  }

  return next();
};
