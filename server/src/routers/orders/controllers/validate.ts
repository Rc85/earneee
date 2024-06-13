import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { OrdersInterface, ProductsInterface } from '../../../../../_shared/types';
import { HttpException, validations } from '../../../utils';

export const validateAddProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { product, quantity, orderId, country } = req.body;
  const { client } = resp.locals;

  if (!product) {
    return next(new HttpException(400, `Product required`));
  } else if (!quantity || typeof quantity !== 'number' || isNaN(quantity)) {
    return next(new HttpException(400, `Invalid quantity`));
  }

  const order = await database.retrieve<OrdersInterface[]>(`SELECT * FROM orders`, {
    where: `id = $1`,
    params: [orderId]
  });

  if (!order.length) {
    return next(new HttpException(400, `Order not found, please refresh and try again`));
  }

  const p = await database.retrieve<ProductsInterface[]>(
    `SELECT
      p.*,
      pu.url,
      pb.brand
    FROM products AS p
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pu.*) AS url
      FROM product_urls AS pu
      WHERE pu.product_id = p.id
    ) AS pu ON true
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pb.*) AS brand
      FROM product_brands AS pb
      WHERE pb.id = p.brand_id
    ) AS pb ON true`,
    {
      where: `id = $1 AND status = $2 AND pu.url->>'country' = $3`,
      params: [product.id, 'available', country],
      client
    }
  );

  if (!p.length) {
    return next(new HttpException(400, `Product does not exist`));
  } else if (product.variants && product.variants.length) {
    const variant = await database.retrieve<ProductsInterface[]>(
      `SELECT
        p.*,
        pu.url
      FROM products AS p
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(pu.*) AS url
        FROM product_urls AS pu
        WHERE pu.product_id = p.id
      ) AS pu ON true`,
      {
        where: `id = $1 AND status = $2 AND parent_id = $3 AND pu.url->>'country' = $4`,
        params: [product.variants[0].id, 'available', product.id, country],
        client
      }
    );

    if (!variant.length) {
      return next(new HttpException(400, `The selected variant does not exist`));
    }

    p[0].variants = [variant[0]];
  }

  req.body.product = p[0];

  return next();
};

export const validateRemoveProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { orderId } = req.query;
  const { client } = resp.locals;

  if (!req.session.user?.id) {
    return next(new HttpException(401, `Unauthorized`));
  }

  const order = await database.retrieve<OrdersInterface[]>(`SELECT * FROM orders`, {
    where: 'id = $1 AND user_id = $2',
    params: [orderId, req.session.user.id],
    client
  });

  if (!order.length) {
    return next(new HttpException(400, `Order not found`));
  }

  return next();
};

export const validateCheckout = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { orderId } = req.body;

  if (!req.session.user?.id) {
    return next(new HttpException(401, `Please log in`));
  } else if (!orderId || typeof orderId !== 'string' || validations.blankCheck.test(orderId)) {
    return next(new HttpException(400, `Order id required`));
  } else if (req.body.cancelUrl && typeof req.body.cancelUrl !== 'string') {
    return next(new HttpException(400, `Invalid cancel url`));
  }

  if (!req.body.cancelUrl) {
    req.body.cancelUrl = '/';
  }

  const order = await database.retrieve<OrdersInterface[]>(
    `SELECT
      o.*,
      COALESCE(oi.items, '[]'::JSONB) AS items
    FROM orders AS o
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(oi.*) AS items
      FROM order_items AS oi
      WHERE oi.order_id = o.id
    ) AS oi ON true`,
    { where: 'o.id = $1 AND o.user_id = $2', params: [orderId, req.session.user.id], client }
  );

  if (!order.length) {
    return next(new HttpException(400, `Order does not exist`));
  }

  for (const item of order[0].items) {
    if (!item.product || typeof item.product !== 'object') {
      return next(new HttpException(400, `Invalid product`));
    }

    const product = await database.retrieve<ProductsInterface[]>('SELECT * FROM products', {
      where: 'id = $1',
      params: [item.product.id],
      client
    });

    if (!product.length || product[0].status !== 'available') {
      return next(new HttpException(400, `${item.product.name} is no longer available`));
    } else if (item.product.variants && item.product.variants.length > 1) {
      return next(new HttpException(400, `Cannot order more than one variant`));
    } else if (item.product.variants && item.product.variants.length === 1) {
      const variant = await database.retrieve<ProductsInterface[]>('SELECT * FROM products', {
        where: 'id = $1',
        params: [item.product.variants[0].id],
        client
      });

      if (!variant.length || variant[0].status !== 'available') {
        return next(
          new HttpException(400, `Variant ${item.product.variants[0].name} is no longer available`)
        );
      }
    }
  }

  resp.locals.order = order[0];

  return next();
};
