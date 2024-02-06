import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const createVariant = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, description, price, featured, status, productId } = req.body;

  const variants = await database.retrieve('product_variants', {
    where: 'product_id = $1',
    params: [productId],
    client
  });

  await database.create(
    'product_variants',
    ['id', 'name', 'description', 'price', 'featured', 'status', 'product_id', 'ordinance'],
    [id, name, description || null, price || 0, Boolean(featured), status, productId, variants.length],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          description = EXCLUDED.description,
          featured = EXCLUDED.featured,
          status = EXCLUDED.status,
          updated_at = NOW()`
      },
      client
    }
  );

  return next();
};
