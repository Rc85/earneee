import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';
import { s3 } from '../../../services';
import { AffiliatesInterface } from '../../../../../_shared/types';

export const deleteAffiliate = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { affiliateId, deleteAllProducts } = req.query;

  const affiliate: AffiliatesInterface[] = await database.delete('affiliates', {
    where: 'id = $1',
    params: [affiliateId],
    client
  });

  if (affiliate.length === 1 && affiliate[0].logoPath) {
    await s3.deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: affiliate[0].logoPath
    });
  }

  if (deleteAllProducts) {
    await database.delete('products', { where: 'affiliate_id = $1', params: [affiliateId], client });
  }

  return next();
};
