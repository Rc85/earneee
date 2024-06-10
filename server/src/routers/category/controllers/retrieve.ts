import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { CategoriesInterface } from '../../../../../_shared/types';

export const retrieveCategories = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const where = [`c.status = 'available'`];
  const params = [];
  const { parentId, categoryId, subcategoryId, groupId, hasProducts, withAncestors } = req.query;
  const id = groupId || subcategoryId || categoryId;

  if (parentId) {
    params.push(parentId);

    where.push(`c.parent_id = $1`);
  } else if (id) {
    params.push(id);

    where.push(`c.id = $1`);
  } else {
    where.push(`c.parent_id IS NULL`);
  }

  if (hasProducts) {
    where.push(`p.count > 0`);
  }

  const categories = await database.retrieve<CategoriesInterface[]>(
    `${
      withAncestors
        ? `WITH RECURSIVE
        ac AS (
          SELECT
            c.id,
            c.name,
            1::int AS depth,
            (ARRAY[]::JSONB[] || JSONB_BUILD_OBJECT('id', c.id, 'name', c.name)) AS ancestors
          FROM categories AS c
          UNION ALL
          SELECT
            c.id,
            c.name,
            ac.depth + 1 AS depth,
            ac.ancestors || JSONB_BUILD_OBJECT('id', c.id, 'name', c.name)
          FROM categories AS c, ac
          WHERE c.parent_id = ac.id
        )`
        : ''
    }
    
    SELECT
      c.id,
      c.name
      ${withAncestors ? ', ac.ancestors' : ''}
    FROM categories AS c
    LEFT JOIN LATERAL (
      SELECT COUNT(p.*)::INT
      FROM products AS p
      WHERE p.category_id = c.id
      AND p.parent_id IS NULL
    ) AS p ON true
    ${
      withAncestors
        ? `LEFT JOIN LATERAL (
            SELECT ac.ancestors, ac.depth FROM ac
            ${parentId || id ? 'WHERE ac.id = $1' : ''}
            ORDER BY ac.depth DESC
          ) AS ac ON true`
        : ''
    }`,
    { where: where.join(' AND '), orderBy: 'c.name', params, client }
  );

  const filteredCategories: CategoriesInterface[] = [];

  for (const category of categories) {
    if (withAncestors) {
      const index = filteredCategories.findIndex((c) => c.id === category.id);

      if (index >= 0) {
        const ancestors = filteredCategories[index].ancestors || [];
        const categoryAncestors = category.ancestors || [];

        let longestAncestors: CategoriesInterface[] = [];

        if (ancestors.length < categoryAncestors.length) {
          longestAncestors = categoryAncestors;
        } else if (ancestors.length > categoryAncestors.length) {
          longestAncestors = ancestors;
        }

        const filteredAncestors = longestAncestors.filter((ancestor) => ancestor.id !== category.id);

        filteredCategories[index].ancestors = filteredAncestors;
      } else {
        filteredCategories.push(category);
      }
    } else {
      filteredCategories.push(category);
    }
  }

  console.log(filteredCategories);

  resp.locals.response = { data: { categories: filteredCategories } };

  return next();
};
