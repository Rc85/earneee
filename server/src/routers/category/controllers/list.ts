import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { CategoriesInterface } from '../../../../../_shared/types';

export const listCategories = async (_: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;

  const categories = await database.retrieve<CategoriesInterface[]>(
    `SELECT
      c.id,
      c.name,
      c.parent_id,
      p.count
    FROM categories AS c
    LEFT JOIN LATERAL (
      SELECT COUNT(p.*)::INT
      FROM products AS p
      WHERE p.category_id = c.id
      AND p.parent_id IS NULL
    ) AS p ON true`,
    { where: `p.count > 0`, client }
  );

  const groupedCategories: CategoriesInterface[][] = [];

  for (const category of categories) {
    if (!category.parentId) {
      if (groupedCategories[0]) {
        groupedCategories[0].push(category);
      } else {
        groupedCategories.push([category]);
      }
    } else {
      const index = groupedCategories.findIndex((c) => c.length > 0 && c[0].parentId === category.parentId);

      if (index >= 0) {
        groupedCategories[index].push(category);
      } else {
        groupedCategories.push([category]);
      }
    }
  }

  resp.locals.response = { data: { categories: groupedCategories } };

  return next();
};
