import { NextFunction, Request, Response } from 'express';
import { database } from '../../../../src/middlewares/database';
import { ProductUrlsInterface } from '../../../../../_shared/types';

export const createVariant = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const {
    id,
    name,
    description,
    featured,
    status,
    productId,
    urls,
    about,
    details,
    excerpt,
    price,
    currency
  } = req.body;

  const variants = await database.retrieve('product_variants', {
    where: 'product_id = $1',
    params: [productId],
    client
  });

  const variant = await database.create(
    'product_variants',
    [
      'id',
      'name',
      'description',
      'featured',
      'status',
      'product_id',
      'ordinance',
      'about',
      'details',
      'excerpt',
      'price',
      'currency'
    ],
    [
      id,
      name,
      description || null,
      Boolean(featured),
      status,
      productId,
      variants.length,
      about,
      details,
      excerpt || null,
      price || 0,
      currency || 'cad'
    ],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          featured = EXCLUDED.featured,
          status = EXCLUDED.status,
          about = EXCLUDED.about,
          details = EXCLUDED.details,
          excerpt = EXCLUDED.excerpt,
          price = EXCLUDED.price,
          currency = EXCLUDED.currency,
          updated_at = NOW()`
      },
      client
    }
  );

  const urlIds = urls ? urls.map((url: ProductUrlsInterface) => url.id) : [];

  await database.delete('product_urls', {
    where: 'NOT (id = ANY($1)) AND variant_id = $2',
    params: [urlIds, variant[0].id],
    client
  });

  if (urls) {
    for (const url of urls) {
      await database.create(
        'product_urls',
        ['id', 'url', 'country', 'variant_id', 'price', 'currency', 'affiliate_id', 'type'],
        [
          url.id,
          url.url,
          url.country,
          variant[0].id,
          url.price || 0,
          url.currency || 'cad',
          url.affiliateId || null,
          url.type || 'affiliate'
        ],
        {
          conflict: {
            columns: 'id',
            do: `UPDATE SET
              url = EXCLUDED.url,
              price = EXCLUDED.price,
              currency = EXCLUDED.currency,
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
