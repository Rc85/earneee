import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const createProductUrl = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, url, country, variantId } = req.body;

  await database.create(
    'product_urls',
    ['id', 'url', 'country', 'variant_id'],
    [id, url, country, variantId],
    {
      conflict: { columns: 'variant_id, country', do: `UPDATE SET url = EXCLUDED.url, updated_at = NOW()` },
      client
    }
  );

  return next();
};
