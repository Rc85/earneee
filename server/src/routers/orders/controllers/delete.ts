import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { RefundPhotosInterface } from '../../../../../_shared/types/refund_photos';
import { s3 } from '../../../services';

export const removeProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { orderItemId, orderId } = req.query;
  const params = [orderId];
  const where = ['order_id = $1'];

  if (orderItemId) {
    params.push(orderItemId);

    where.push(`id = $${params.length}`);
  }

  await database.delete('order_items', {
    where: where.join(' AND '),
    params,
    client
  });

  await database.update('orders', '', {
    where: 'id = $1',
    params: [orderId],
    client
  });

  resp.locals.response = { data: { statusText: 'Item(s) removed' } };

  return next();
};

export const deleteRefundPhoto = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { photoId, refundId } = req.query;

  const photo = await database.retrieve<RefundPhotosInterface[]>(`SELECT * FROM refund_photos`, {
    where: 'id = $1 AND refund_id = $2',
    params: [photoId, refundId],
    client
  });

  if (photo.length) {
    await s3.deleteObject({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: photo[0].path
    });

    await database.delete('refund_photos', {
      where: 'id = $1 AND refund_id = $2',
      params: [photoId, refundId],
      client
    });
  }

  return next();
};
