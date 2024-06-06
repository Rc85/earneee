import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import { database } from '../../../middlewares';
import { s3 } from '../../../services';
import { ProductBrandsInterface } from '../../../../../_shared/types';
import { generateKey } from '../../../../../_shared/utils';

export const createBrand = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, owner, url, logoUrl, logoPath, status } = req.body;

  let logo = logoUrl;
  let path = logoPath;

  if (logoUrl && /^data:image\/(png|jpeg);base64.*/.test(logoUrl)) {
    const base64 = logoUrl.split(',')[1];
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

    logo = `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_ENDPOINT}/${key}?ETag=${eTag}`;
    path = key;
  } else if (!logoUrl && logoPath) {
    await s3.deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: logoPath
    });
  }

  const brand: ProductBrandsInterface[] = await database.create(
    'product_brands',
    ['id', 'name', 'owner', 'logo_path', 'logo_url', 'url', 'status'],
    [id || generateKey(1), name, owner, path, logo, url, status],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          name = EXCLUDED.name,
          owner = EXCLUDED.owner,
          logo_path = EXCLUDED.logo_path,
          logo_url = EXCLUDED.logo_url,
          url = EXCLUDED.url,
          status = EXCLUDED.status,
          updated_at = NOW()`
      },
      client
    }
  );

  if (brand.length && brand[0].updatedAt) {
    resp.locals.response = { data: { statusText: 'Brand updated' } };
  }

  return next();
};
