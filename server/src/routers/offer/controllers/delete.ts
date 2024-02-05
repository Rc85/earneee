import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';
import { OffersInterface } from '../../../../../_shared/types';
import { s3 } from '../../../services';

export const deleteOffer = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { offerId } = req.query;

  const offer: OffersInterface[] = await database.delete('offers', {
    where: 'id = $1',
    params: [offerId],
    client
  });

  if (offer.length === 1 && offer[0].logoPath) {
    await s3.deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: offer[0].logoPath
    });
  }

  return next();
};
