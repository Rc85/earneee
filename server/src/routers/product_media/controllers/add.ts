import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const addProductMedia = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, url, path, height, width, type, variantId, status, productId } = req.body;

  await database.create(
    'product_media',
    ['id', 'url', 'path', 'height', 'width', 'type', 'variant_id', 'status', 'product_id'],
    [id, url, path, height, width, type, variantId || null, status, productId],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          url = EXCLUDED.url,
          path = EXCLUDED.path,
          height = EXCLUDED.height,
          width = EXCLUDED.width,
          type = EXCLUDED.type,
          status = EXCLUDED.status,
          updated_at = NOW()`
      },
      client
    }
  );

  return next();
};
