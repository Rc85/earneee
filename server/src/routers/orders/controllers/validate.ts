import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { OrdersInterface, ProductsInterface } from '../../../../../_shared/types';
import { HttpException } from '../../../utils';

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
      pu.url
    FROM products AS p
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pu.*) AS url
      FROM product_urls AS pu
      WHERE pu.product_id = p.id
    ) AS pu ON true`,
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
