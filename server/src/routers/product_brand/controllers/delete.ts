import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';
import { s3 } from '../../../services';

export const deleteBrand = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { brandId } = req.query;

  const brand = await database.delete('product_brands', { where: 'id = $1', params: [brandId], client });

  if (brand.length && brand[0].logoPath) {
    await s3.deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: brand[0].logoPath
    });
  }

  return next();
};
