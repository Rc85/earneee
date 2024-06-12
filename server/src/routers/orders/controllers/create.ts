import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { generateKey } from '../../../../../_shared/utils';
import { ProductsInterface } from '../../../../../_shared/types';

export const addProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { orderId, quantity, orderItemId } = req.body;
  const product: ProductsInterface = req.body.product;

  const id = orderItemId || generateKey(1);
  const name = `${product?.brand ? `${product.brand.name} ` : ''}${product.name}`;
  const price = (product.url?.price || 0) + (product.variants?.[0]?.url?.price || 0);

  await database.create(
    'order_items',
    ['id', 'name', 'price', 'order_id', 'product', 'quantity'],
    [id, name, price, orderId, product, quantity],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, product = EXCLUDED.product, quantity = EXCLUDED.quantity, updated_at = now()`
      },
      client
    }
  );

  resp.locals.response = { data: { statusText: orderItemId ? 'Item updated' : 'Item added' } };

  return next();
};
