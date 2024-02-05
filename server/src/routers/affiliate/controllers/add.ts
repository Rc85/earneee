import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import { s3 } from '../../../services';
import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { database } from '../../../database';
import { AffiliateUrlsInterface, AffiliatesInterface } from '../../../../../_shared/types';

export const addAffiliate = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, description, logoUrl, managerUrl, commissionRate, rateType, status, urls } = req.body;

  let url = null;
  let path = null;

  if (logoUrl && /^data:image\/png;base64.*/.test(logoUrl)) {
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

    url = `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_ENDPOINT}/${key}?ETag=${eTag}`;
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
    [
      'id',
      'name',
      'description',
      'logo_url',
      'logo_path',
      'manager_url',
      'commission_rate',
      'rate_type',
      'status'
    ],
    [id, name, description || null, url, path, managerUrl, commissionRate || 0, rateType, status],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          logo_url = EXCLUDED.logo_url,
          logo_path = EXCLUDED.logo_path,
          manager_url = EXCLUDED.manager_url,
          commission_rate = EXCLUDED.commission_rate,
          rate_type = EXCLUDED.rate_type,
          status = EXCLUDED.status,
          updated_at = NOW()`
      },
      client
    }
  );

  const affiliateId = affiliate[0].id;

  if (urls) {
    const affiliateUrls: AffiliateUrlsInterface[] = urls;
    const urlIds = affiliateUrls.map((url) => url.id);

    await database.delete('affiliate_urls', { where: 'NOT (id = ANY($1))', params: [urlIds], client });

    for (const url of affiliateUrls) {
      await database.create(
        'affiliate_urls',
        ['id', 'url', 'country', 'affiliate_id'],
        [url.id, url.url, url.country, affiliateId],
        {
          conflict: {
            columns: 'id',
            do: `UPDATE SET url = EXCLUDED.url, country = EXCLUDED.country, updated_at = NOW()`
          },
          client
        }
      );
    }
  }

  if (affiliate[0].updatedAt) {
    resp.locals.response = { data: { statusText: 'Affiliate updated' } };
  }

  return next();
};
