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
  const price =
    (product.url?.price || 0) +
    (product.variants?.[0]?.url?.price || 0) +
    (product.options?.reduce(
      (acc, option) =>
        acc + (option.selections?.reduce((acc, selection) => acc + (selection.price || 0), 0) || 0),
      0
    ) || 0);

  const orderProduct: any = {
    id: product.id,
    url: {
      price: product.url?.price,
      currency: product.url?.currency,
      refundTime: product.url?.refundTime,
      shippingTime: product.url?.shippingTime
    }
  };

  if (product.variants && product.variants.length) {
    orderProduct.variants = [
      {
        id: product.variants?.[0]?.id,
        name: product.variants?.[0]?.name,
        url: { price: product.variants?.[0]?.url?.price, currency: product.variants?.[0]?.url?.currency }
      }
    ];
  }

  if (product.options && product.options.length) {
    orderProduct.options = product.options;
  }

  await database.create(
    'order_items',
    ['id', 'name', 'price', 'order_id', 'product', 'quantity'],
    [id, name, price, orderId, orderProduct, quantity],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, product = EXCLUDED.product, quantity = EXCLUDED.quantity, updated_at = now()`
      },
      client
    }
  );

  await database.update('orders', '', {
    where: 'id = $1',
    params: [orderId],
    client
  });

  resp.locals.response = { data: { statusText: orderItemId ? 'Item updated' : 'Item added' } };

  return next();
};
