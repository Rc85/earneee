import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';
import { ProductMediaInterface } from '../../../../../_shared/types';
import { s3 } from '../../../services';

export const deleteProductMedia = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { mediaId } = req.query;

  const media: ProductMediaInterface[] = await database.delete('product_media', {
    where: 'id = $1',
    params: [mediaId],
    client
  });

  if (media.length && media[0].path) {
    await s3.deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: media[0].path
    });
  }

  return next();
};
