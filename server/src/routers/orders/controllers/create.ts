import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { generateKey } from '../../../../../_shared/utils';
import { OrdersInterface, ProductsInterface } from '../../../../../_shared/types';

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

export const createShipment = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { orderShipment } = req.body;
  const { orderId, trackingNumber, shippingProvider, eta, items } = orderShipment;

  const id = req.body.id || generateKey(1);

  const shipment = await database.create(
    'order_shipments',
    ['id', 'order_id', 'tracking_number', 'shipping_provider', 'eta'],
    [id, orderId, trackingNumber || null, shippingProvider, eta || null],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          tracking_number = EXCLUDED.tracking_number,
          shipping_provider = EXCLUDED.shipping_provider,
          eta = EXCLUDED.eta,
          updated_at = now()`
      },
      client
    }
  );

  if (items) {
    for (const item of items) {
      await database.update('order_items', ['status', 'order_shipment_id'], {
        where: 'id = $3',
        params: ['shipped', shipment[0].id, item.id],
        client
      });
    }
  }

  const order = await database.retrieve<OrdersInterface[]>(`SELECT * FROM orders`, {
    where: 'id = $1',
    params: [orderId],
    client
  });

  await database.create(
    'user_messages',
    ['user_id', 'type', 'message'],
    [order[0].userId, 'notification', `Shipping for order ${order[0].number} has been updated`],
    { client }
  );

  resp.locals.response = {
    data: { statusText: shipment[0].updatedAt ? 'Order shipment updated' : 'Order shipment created' }
  };

  return next();
};
