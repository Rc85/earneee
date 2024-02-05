import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const createCategory = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, type, parentId, status, ordinance } = req.body;

  const params = [];
  const where = [];

  if (parentId) {
    params.push(parentId);

    where.push(`parent_id = $1`);
  } else {
    where.push(`parent_id IS NULL`);
  }

  const categories = await database.retrieve('categories', { where: where.join(' AND '), params, client });

  const columns = ['name', 'type', 'parent_id', 'status', 'ordinance'];
  const values = [name, type, parentId, status, ordinance || categories.length];

  if (id) {
    columns.push('id');

    values.push(id);
  }

  await database.create('categories', columns, values, {
    conflict: {
      columns: 'id',
      do: `UPDATE SET
        name = EXCLUDED.name,
        type = EXCLUDED.type,
        ordinance = EXCLUDED.ordinance,
        status = EXCLUDED.status,
        updated_at = NOW()`
    },
    client
  });

  return next();
};
