import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';
import { ProductUrlsInterface } from '../../../../../_shared/types';

export const createVariant = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, description, price, featured, status, productId, currency, urls, about, details } =
    req.body;

  const variants = await database.retrieve('product_variants', {
    where: 'product_id = $1',
    params: [productId],
    client
  });

  await database.create(
    'product_variants',
    [
      'id',
      'name',
      'description',
      'price',
      'currency',
      'featured',
      'status',
      'product_id',
      'ordinance',
      'about',
      'details'
    ],
    [
      id,
      name,
      description || null,
      price || 0,
      currency || 'cad',
      Boolean(featured),
      status,
      productId,
      variants.length,
      about,
      details
    ],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          name = EXCLUDED.name,
          price = EXCLUDED.price,
          currency = EXCLUDED.currency,
          description = EXCLUDED.description,
          featured = EXCLUDED.featured,
          status = EXCLUDED.status,
          about = EXCLUDED.about,
          details = EXCLUDED.details,
          updated_at = NOW()`
      },
      client
    }
  );

  if (urls) {
    const urlIds = urls.map((url: ProductUrlsInterface) => url.id);

    await database.delete('product_urls', { where: 'NOT (id = ANY($1))', params: [urlIds], client });

    for (const url of urls) {
      await database.create(
        'product_urls',
        ['id', 'url', 'country', 'variant_id'],
        [url.id, url.url, url.country, id],
        {
          conflict: {
            columns: 'variant_id, country',
            do: `UPDATE SET url = EXCLUDED.url, updated_at = NOW()`
          },
          client
        }
      );
    }
  }

  return next();
};
