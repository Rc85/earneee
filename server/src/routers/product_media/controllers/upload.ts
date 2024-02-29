import { ObjectCannedACL } from '@aws-sdk/client-s3';
import { NextFunction, Request, Response } from 'express';
import sharp from 'sharp';
import { s3 } from '../../../services';
import { generateKey } from '../../../../../_shared/utils';
import { database } from '../../../database';

export const uploadProductMedia = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const file = req.files?.[0];
  const { image, variantId, productId } = req.body;

  if (image) {
    const base64 = image.split(',')[1];
    const id = generateKey(1);
    const buffer = Buffer.from(base64, 'base64');
    const { info, data } = await sharp(buffer)
      .withMetadata()
      .resize(500)
      .toBuffer({ resolveWithObject: true });

    const key = `product_media/${variantId}/${id}.png`;
    const params = {
      Body: data,
      Bucket: process.env.S3_BUCKET_NAME || '',
      Key: key,
      ACL: 'public-read' as ObjectCannedACL,
      CacheControl: 'max-age=604800',
      ContentType: 'image/jpeg'
    };

    const object = await s3.putObject(params);
    const eTag = object.ETag ? object.ETag.replace(/"/g, '') : '';
    const url = `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_ENDPOINT}/${key}?ETag=${eTag}`;

    await database.create(
      'product_media',
      ['id', 'url', 'path', 'width', 'height', 'variant_id', 'type', 'product_id'],
      [id, url, key, info.width, info.height, variantId || null, 'image', productId],
      { client }
    );
  } else if (file) {
    const fileChunks = file.originalname.split('./retrieve');
    const extension = fileChunks[fileChunks.length - 1];
    const id = generateKey(1);
    const key = `product_media/${variantId}/${id}.${extension}`;
    const params = {
      Body: file.buffer,
      Bucket: process.env.S3_BUCKET_NAME || '',
      Key: key,
      ACL: 'public-read' as ObjectCannedACL,
      CacheControl: 'max-age=604800',
      ContentType: file.mimetype
    };

    const object = await s3.putObject(params);
    const eTag = object.ETag ? object.ETag.replace(/"/g, '') : '';
    const url = `https://${process.env.S3_BUCKET_NAME}.${process.env.S3_ENDPOINT}/${key}?ETag=${eTag}`;

    await database.create(
      'product_media',
      ['id', 'url', 'path', 'width', 'height', 'variant_id', 'type', 'product_id'],
      [id, url, key, 0, 0, variantId || null, 'video', productId],
      { client }
    );
  }

  return next();
};
