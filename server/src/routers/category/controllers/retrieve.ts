import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';

export const retrieveCategories = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const where = [`c.status = 'available'`];
  const params = [];
  const { parentId, categoryId, subcategoryId, groupId, hasProducts } = req.query;
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

  const categories = await database.retrieve(
    `SELECT
      c.id,
      c.name
    FROM categories AS c
    LEFT JOIN LATERAL (
      SELECT COUNT(p.*)::INT
      FROM products AS p
      WHERE p.category_id = c.id
    ) AS p ON true`,
    { where: where.join(' AND '), orderBy: 'c.name', params, client }
  );

  resp.locals.response = { data: { categories } };

  return next();
};
