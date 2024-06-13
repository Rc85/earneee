import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';

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
