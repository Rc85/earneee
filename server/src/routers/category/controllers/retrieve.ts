import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveCategories = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const where = [];
  const params = [];
  const { parentId, level, categoryId, subcategoryId, groupId } = req.query;
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

  if (level && ['2', '3'].includes(level.toString())) {
    where.push(`(JSONB_ARRAY_LENGTH(c1.subcategories) > 0 OR p.product > 0)`);
  }

  const categories = await database.category.retrieve[(level?.toString() as '1' | '2' | '3') || '1']({
    where: where.join(' AND '),
    params,
    orderBy: 'c.ordinance',
    client
  });

  resp.locals.response = { data: { categories } };

  return next();
};
