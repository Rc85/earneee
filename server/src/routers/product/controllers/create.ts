import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';
import { generateKey } from '../../../../../_shared/utils';
import sharp from 'sharp';
import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { s3 } from '../../../services';

export const createProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { product, brand } = req.body;
  const { id, name, excerpt, categoryId, description, status, about, details, type } = product;

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

  await database.create(
    'products',
    ['id', 'name', 'excerpt', 'category_id', 'brand_id', 'description', 'status', 'about', 'details', 'type'],
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
      type
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
          type = EXCLUDED.type,
          updated_at = NOW()`
      },
      client
    }
  );

  return next();
};
