import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const createProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, excerpt, categoryId, brandId, description, status, about, details, type } = req.body;

  await database.create(
    'products',
    ['id', 'name', 'excerpt', 'category_id', 'brand_id', 'description', 'status', 'about', 'details', 'type'],
    [
      id,
      name,
      excerpt || null,
      categoryId,
      brandId || null,
      description || null,
      status,
      about || null,
      details || null,
      type
    ],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          name = EXCLUDED.name,
          excerpt = EXCLUDED.excerpt,
          category_id = EXCLUDED.category_id,
          brand_id = EXCLUDED.brand_id,
          description = EXCLUDED.description,
          status = EXCLUDED.status,
          about = EXCLUDED.about,
          details = EXCLUDED.details,
          type = EXCLUDED.type,
          updated_at = NOW()`
      },
      client
    }
  );

  return next();
};
