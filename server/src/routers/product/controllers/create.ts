import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const createProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, excerpt, categoryId, type, affiliateId, brandId, description, status } = req.body;

  await database.create(
    'products',
    ['id', 'name', 'excerpt', 'category_id', 'type', 'affiliate_id', 'brand_id', 'description', 'status'],
    [id, name, excerpt, categoryId, type, affiliateId, brandId, description, status],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          name = EXCLUDED.name,
          excerpt = EXCLUDED.excerpt,
          category_id = EXCLUDED.category_id,
          type = EXCLUDED.type,
          affiliate_id = EXCLUDED.affiliate_id,
          brand_id = EXCLUDED.brand_id,
          description = EXCLUDED.description,
          status = EXCLUDED.status,
          updated_at = NOW()`
      },
      client
    }
  );

  return next();
};
