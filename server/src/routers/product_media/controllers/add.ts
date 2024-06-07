import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { generateKey } from '../../../../../_shared/utils';

export const addProductMedia = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, url, path, height, width, type, status, productId } = req.body;

  await database.create(
    'product_media',
    ['id', 'url', 'path', 'height', 'width', 'type', 'status', 'product_id'],
    [id || generateKey(1), url, path, height, width, type, status, productId],
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
