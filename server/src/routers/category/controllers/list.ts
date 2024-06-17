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
      AND p.parent_id IS null
      AND p.published IS true
    ) AS p ON true`,
    { where: `c.parent_id IS null`, client }
  );

  const subcategories = await database.retrieve<CategoriesInterface[]>(
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
      AND p.parent_id IS null
      AND p.published IS true
    ) AS p ON true`,
    { where: `c.parent_id IS NOT null`, client }
  );

  for (const category of categories) {
    await buildSubcategories(category, subcategories);
  }

  resp.locals.response = {
    data: {
      categories: categories.filter((category) => category.subcategories && category.subcategories.length)
    }
  };

  return next();
};

export const buildSubcategories = (category: CategoriesInterface, subcategories: CategoriesInterface[]) => {
  const c1 = subcategories.filter((s) => s.parentId === category.id);
  const c2 = subcategories.filter((s) => s.parentId !== category.id);

  if (c1.length) {
    const s: CategoriesInterface[] = [];

    for (const subcategory of c1) {
      if (c2.length > 0) {
        const c3 = buildSubcategories(subcategory, c2);

        if (c3?.subcategories && c3.subcategories.length) {
          s.push(c3);
          // @ts-ignore
        } else if (subcategory.count) {
          s.push(subcategory);
        }
      }
    }

    category.subcategories = s;

    return category;
  }
};
