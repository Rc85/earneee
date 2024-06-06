import { NextFunction, Request, Response } from 'express';
import { database } from '../../../../src/middlewares/database';
import { generateKey } from '../../../../../_shared/utils';
import sharp from 'sharp';
import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { s3 } from '../../../services';
import { ProductUrlsInterface } from '../../../../../_shared/types';

export const createProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { product, brand } = req.body;
  const { id, name, excerpt, categoryId, description, status, about, details, urls } = product;

  let { brandId } = product;

  if (brand) {
    let url = null;
    let path = null;

    if (brand.logoUrl) {
      const base64 = brand.logoUrl.split(',')[1];
      const buffer = Buffer.from(base64, 'base64');
      const body = await sharp(buffer).withMetadata().resize(500).toBuffer();
      const key = `brands/${id}/logo.png`;
      const params = {
        Body: body,
        Bucket: process.env.S3_BUCKET_NAME || '',
        Key: key,
        ACL: 'public-read' as ObjectCannedACL,
        CacheControl: 'max-age=604800',
        ContentType: 'image/jpeg'
      };

      const data = await s3.putObject(params);
      const eTag = data.ETag ? data.ETag.replace(/"/g, '') : '';

      url = `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_ENDPOINT}/${key}?ETag=${eTag}`;
      path = key;
    }

    const createdBrand = await database.create(
      'product_brands',
      ['id', 'name', 'owner', 'logo_url', 'logo_path'],
      [brand.id || generateKey(1), brand.name, brand.owner || null, url, path],
      { client }
    );

    brandId = createdBrand[0].id;
  }

  const createdProduct = await database.create(
    'products',
    ['id', 'name', 'excerpt', 'category_id', 'brand_id', 'description', 'status', 'about', 'details'],
    [
      id,
      name,
      excerpt || null,
      categoryId,
      brandId || null,
      description || null,
      status,
      about || null,
      details || null
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
          updated_at = NOW()`
      },
      client
    }
  );

  const urlIds = urls ? urls.map((url: ProductUrlsInterface) => url.id) : [];

  await database.delete('product_urls', {
    where: 'NOT (id = ANY($1)) AND product_id = $2 AND variant_id IS NULL',
    params: [urlIds, createdProduct[0].id],
    client
  });

  if (urls) {
    for (const url of urls) {
      await database.create(
        'product_urls',
        ['id', 'url', 'country', 'product_id', 'price', 'currency', 'affiliate_id', 'type'],
        [
          url.id,
          url.url,
          url.country,
          createdProduct[0].id,
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
