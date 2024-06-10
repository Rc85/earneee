import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { generateKey } from '../../../../../_shared/utils';
import sharp from 'sharp';
import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { s3 } from '../../../services';
import { ProductUrlsInterface } from '../../../../../_shared/types';
import dayjs from 'dayjs';

export const createProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { product, brand } = req.body;
  const {
    id,
    name,
    excerpt,
    categoryId,
    description,
    status,
    about,
    details,
    urls,
    parentId,
    featured,
    review
  } = product;

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
      'parent_id',
      'featured',
      'review'
    ],
    [
      id || generateKey(1),
      name,
      excerpt || null,
      categoryId,
      brandId || null,
      description || null,
      status,
      about || null,
      details || null,
      parentId || null,
      Boolean(featured),
      review || null
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
          parent_id = EXCLUDED.parent_id,
          featured = EXCLUDED.featured,
          review = EXCLUDED.review,
          updated_at = NOW()`
      },
      client
    }
  );

  const urlIds = urls ? urls.map((url: ProductUrlsInterface) => url.id) : [];

  await database.delete('product_urls', {
    where: 'NOT (id = ANY($1)) AND product_id = $2',
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

      if (url.discounts) {
        for (const discount of url.discounts) {
          if (discount.status === 'deleted') {
            await database.delete('product_discounts', { where: 'id = $1', params: [discount.id], client });
          } else {
            await database.create(
              'product_discounts',
              [
                'id',
                'amount',
                'amount_type',
                'product_url_id',
                'starts_at',
                'ends_at',
                'status',
                'limited_time_only'
              ],
              [
                discount.id,
                discount.amount,
                discount.amountType,
                url.id,
                discount.startsAt
                  ? dayjs(discount.startsAt).set('hour', 23).set('minute', 59).set('second', 59).toDate()
                  : dayjs().toDate(),
                discount.endsAt
                  ? dayjs(discount.endsAt).set('hour', 23).set('minute', 59).set('second', 59).toDate()
                  : null,
                discount.status,
                discount.limitedTimeOnly
              ],
              {
                conflict: {
                  columns: 'id',
                  do: `UPDATE SET
                    amount = EXCLUDED.amount,
                    amount_type = EXCLUDED.amount_type,
                    product_url_id = EXCLUDED.product_url_id,
                    starts_at = EXCLUDED.starts_at,
                    ends_at = EXCLUDED.ends_at,
                    status = EXCLUDED.status,
                    limited_time_only = EXCLUDED.limited_time_only,
                    updated_at = NOW()`
                },
                client
              }
            );
          }
        }
      }
    }
  }

  return next();
};
