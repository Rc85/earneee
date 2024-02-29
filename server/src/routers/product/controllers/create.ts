import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const createProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const {
    id,
    name,
    excerpt,
    categoryId,
    brandId,
    description,
    status,
    about,
    details,
    price,
    currency,
    urls
  } = req.body;

  await database.create(
    'products',
    [
      'id',
      'name',
      'excerpt',
      'category_id',
      'brand_id',
      'description',
      'status',
      'about',
      'details',
      'price',
      'currency'
    ],
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
      price || null,
      currency || null
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
          price = EXCLUDED.price,
          currency = EXCLUDED.currency,
          updated_at = NOW()`
      },
      client
    }
  );

  const urlIds = urls ? urls.map((url: any) => url.id) : [];

  await database.delete('product_urls', {
    where: 'NOT (id = ANY($1)) AND product_id = $2 AND variant_id IS NULL',
    params: [urlIds, id],
    client
  });

  if (urls) {
    for (const url of urls) {
      await database.create(
        'product_urls',
        ['id', 'product_id', 'url', 'price', 'currency', 'country', 'affiliate_id', 'type'],
        [
          url.id,
          id,
          url.url,
          url.price || 0,
          url.currency || 'cad',
          url.country || 'CA',
          url.affiliateId,
          url.type || 'affiliate'
        ],
        {
          conflict: {
            columns: 'product_id, country',
            where: 'variant_id IS NULL',
            do: `UPDATE SET
              url = EXCLUDED.url,
              price = EXCLUDED.price,
              currency = EXCLUDED.currency,
              country = EXCLUDED.country,
              affiliate_id = EXCLUDED.affiliate_id,
              type = EXCLUDED.type,
              updated_at = NOW()`
          },
          client
        }
      );
    }
  }

  return next();
};
