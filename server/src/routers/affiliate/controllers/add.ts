import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import { s3 } from '../../../services';
import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { database } from '../../../middlewares';
import { AffiliatesInterface } from '../../../../../_shared/types';

export const addAffiliate = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, url, description, logoUrl, managerUrl, status, logoPath } = req.body;

  let logo = logoUrl;
  let path = logoPath;

  console.log(logoPath);

  if (logoUrl && /^data:image\/(jpeg|png);base64.*/.test(logoUrl)) {
    const base64 = logoUrl.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const body = await sharp(buffer).withMetadata().resize(500).toBuffer();
    const key = `affiliates/${id}/logo.png`;
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
  } else if (!logoUrl) {
    const affiliate: AffiliatesInterface[] = await database.retrieve('affiliates', {
      where: 'id = $1',
      params: [id],
      client
    });

    if (affiliate.length === 1 && affiliate[0].logoPath) {
      await s3.deleteObject({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: affiliate[0].logoPath
      });
    }
  }

  const affiliate: AffiliatesInterface[] = await database.create(
    'affiliates',
    ['id', 'name', 'url', 'description', 'logo_url', 'logo_path', 'manager_url', 'status'],
    [id, name, url, description || null, logo, path, managerUrl, status],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          name = EXCLUDED.name,
          url = EXCLUDED.url,
          description = EXCLUDED.description,
          logo_url = EXCLUDED.logo_url,
          logo_path = EXCLUDED.logo_path,
          manager_url = EXCLUDED.manager_url,
          status = EXCLUDED.status,
          updated_at = NOW()`
      },
      client
    }
  );

  if (affiliate[0].updatedAt) {
    resp.locals.response = { data: { statusText: 'Affiliate updated' } };
  }

  return next();
};
