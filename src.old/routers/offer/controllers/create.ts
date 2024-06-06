import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import { OffersInterface } from '../../../../../_shared/types';
import { database } from '../../../../src/middlewares/database';
import { s3 } from '../../../services';

export const createOffer = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, url, logoUrl, logoPath, logoWidth, logoHeight, startDate, endDate, details, status } =
    req.body;

  let bannerUrl = logoUrl;
  let path = logoPath;

  if (logoUrl && /^data:image\/(png|jpeg);base64.*/.test(logoUrl)) {
    const base64 = logoUrl.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const body = await sharp(buffer).withMetadata().resize(500).toBuffer();
    const key = `offers/${id}/banner.png`;
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

    bannerUrl = `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_ENDPOINT}/${key}?ETag=${eTag}`;
    path = key;
  }

  const offer: OffersInterface[] = await database.create(
    'offers',
    [
      'id',
      'name',
      'logo_url',
      'logo_path',
      'url',
      'details',
      'status',
      'start_date',
      'end_date',
      'logo_width',
      'logo_height'
    ],
    [id, name, bannerUrl, path, url, details, status, startDate, endDate, logoWidth, logoHeight],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          name = EXCLUDED.name,
          logo_url = EXCLUDED.logo_url,
          logo_path = EXCLUDED.logo_path,
          url = EXCLUDED.url,
          details = EXCLUDED.details,
          status = EXCLUDED.status,
          start_date = EXCLUDED.start_date,
          end_date = EXCLUDED.end_date,
          logo_width = EXCLUDED.logo_width,
          logo_height = EXCLUDED.logo_height,
          updated_at = NOW()`
      },
      client
    }
  );

  if (offer.length === 1 && offer[0].updatedAt) {
    resp.locals.response = { data: { statusText: 'Offer updated' } };
  }

  return next();
};
