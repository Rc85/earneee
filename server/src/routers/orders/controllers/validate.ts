import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import {
  OrderItemsInterface,
  OrdersInterface,
  ProductOptionsInterface,
  ProductsInterface,
  RefundsInterface
} from '../../../../../_shared/types';
import { HttpException, validations } from '../../../utils';
import dayjs from 'dayjs';
import { stripe } from '../../../services';
import Stripe from 'stripe';

export const validateAddProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { product, quantity, orderId, country } = req.body;
  const { client } = resp.locals;

  if (!req.session.user?.id) {
    return next(new HttpException(401, `Please log in to add products`));
  } else if (!product) {
    return next(new HttpException(400, `Product required`));
  } else if (!quantity || typeof quantity !== 'number' || isNaN(quantity)) {
    return next(new HttpException(400, `Invalid quantity`));
  }

  const order = await database.retrieve<OrdersInterface[]>(`SELECT * FROM orders`, {
    where: `id = $1 AND user_id = $2 AND status = $3`,
    params: [orderId, req.session.user.id, 'draft']
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

  if (product.options) {
    const productOptions = [];

    for (const option of product.options) {
      if (!option.selections || !option.selections.length) {
        return next(new HttpException(400, `${option.name} must have at least 1 selection`));
      }

      const productOption = await database.retrieve<ProductOptionsInterface[]>(
        `SELECT
          po.*,
          COALESCE(os.selections, '[]'::JSONB) AS selections
        FROM product_options AS po
        LEFT JOIN LATERAL (
          SELECT JSONB_AGG(os.*) AS selections
          FROM option_selections AS os
          WHERE os.option_id = po.id
        ) AS os ON true`,
        {
          where: `po.id = $1`,
          params: [option.id],
          client
        }
      );

      for (const selection of option.selections) {
        const optionSelection = productOption[0].selections?.find((s) => s.id === selection.id);

        if (
          !productOption.length ||
          productOption[0].status !== 'available' ||
          !optionSelection ||
          optionSelection.status !== 'available'
        ) {
          return next(new HttpException(400, `${selection.name} is no longer available`));
        }
      }

      productOptions.push(option);
    }

    p[0].options = productOptions;
  }

  req.body.product = p[0];

  return next();
};

export const validateRemoveProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { orderId } = req.query;
  const { client } = resp.locals;

  if (!req.session.user?.id) {
    return next(new HttpException(401, `Please log in`));
  }

  const order = await database.retrieve<OrdersInterface[]>(`SELECT * FROM orders`, {
    where: 'id = $1 AND user_id = $2 AND status = $3',
    params: [orderId, req.session.user.id, 'draft'],
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
    {
      where: 'o.id = $1 AND o.user_id = $2 AND o.status = $3',
      params: [orderId, req.session.user.id, 'draft'],
      client
    }
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

    if (item.product.options) {
      for (const option of item.product.options) {
        const productOption = await database.retrieve<ProductOptionsInterface[]>(
          `SELECT
            po.*,
            COALESCE(os.selections, '[]'::JSONB) AS selections
          FROM product_options AS po
          LEFT JOIN LATERAL (
            SELECT JSONB_AGG(os.*) AS selections
            FROM option_selections AS os
            WHERE os.option_id = po.id
          ) AS os ON true`,
          {
            where: `po.id = $1`,
            params: [option.id],
            client
          }
        );

        if (option.selections) {
          for (const selection of option.selections) {
            const optionSelection = productOption[0].selections?.find((s) => s.id === selection.id);

            if (
              !productOption.length ||
              productOption[0].status !== 'available' ||
              !optionSelection ||
              optionSelection.status !== 'available'
            ) {
              return next(new HttpException(400, `${selection.name} is no longer available`));
            }
          }
        }
      }
    }
  }

  resp.locals.order = order[0];

  return next();
};

export const validateCreateOrderShipment = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { orderShipment } = req.body;

  if (!orderShipment) {
    return next(new HttpException(400, `Order shipment required`));
  } else if (
    !orderShipment.shippingProvider ||
    typeof orderShipment.shippingProvider !== 'string' ||
    validations.blankCheck.test(orderShipment.shippingProvider)
  ) {
    return next(new HttpException(400, `Shipping provider required`));
  } else if (
    orderShipment.trackingNumber &&
    (typeof orderShipment.trackingNumber !== 'string' ||
      validations.blankCheck.test(orderShipment.trackingNumber))
  ) {
    return next(new HttpException(400, `Tracking number required`));
  } else if (orderShipment.eta && !dayjs(orderShipment.eta).isValid()) {
    return next(new HttpException(400, `Invalid eta`));
  }

  if (orderShipment.items) {
    for (const item of orderShipment.items) {
      const orderItem = await database.retrieve<OrderItemsInterface[]>('SELECT * FROM order_items', {
        where: 'id = $1 AND status = $2',
        params: [item.id, 'processed'],
        client
      });

      if (!orderItem.length) {
        return next(new HttpException(400, `Order item ${item.name} does not exist`));
      }
    }
  }

  return next();
};

export const validateUpdateOrderItem = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { orderItem } = req.body;

  if (!orderItem) {
    return next(new HttpException(400, `Order item required`));
  } else if (!['processed', 'shipped', 'delivered', 'refunded'].includes(orderItem.status)) {
    return next(new HttpException(400, `Invalid status`));
  }

  const item = await database.retrieve<OrderItemsInterface[]>('SELECT * FROM order_items', {
    where: 'id = $1',
    params: [orderItem.id],
    client
  });

  if (!item.length) {
    return next(new HttpException(400, `${orderItem.name} does not exist`));
  }

  return next();
};

export const validateRefundOrderItem = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { orderItemId, quantity } = req.body;

  const orderItem = await database.retrieve<OrderItemsInterface[]>(`SELECT * FROM order_items`, {
    where: 'id = $1',
    params: [orderItemId],
    client
  });

  if (!orderItem.length) {
    return next(new HttpException(400, `Order item does not exist`));
  }

  const refunds = await database.retrieve<RefundsInterface[]>(`SELECT * FROM refunds`, {
    where: 'order_item_id = $1',
    params: [orderItemId]
  });

  if (refunds.length) {
    const qty = refunds.reduce((acc, refund) => acc + refund.quantity, 0);

    if (qty === orderItem[0].quantity) {
      return next(new HttpException(400, `Cannot refund anymore of that item`));
    } else if (quantity > orderItem[0].quantity - qty) {
      return next(new HttpException(400, `Quantity cannot exceed remaining ${orderItem[0].quantity - qty}`));
    }
  }

  const order = await database.retrieve<OrdersInterface[]>(
    `SELECT
      o.*
    FROM orders AS o`,
    { where: `o.id = $1`, params: [orderItem[0].orderId], client }
  );

  if (order.length && order[0].sessionId) {
    const lineItem = await findLineItem(order[0].sessionId, orderItemId, undefined, 10);

    if (!lineItem) {
      return next(new HttpException(400, `Order item not found`));
    }

    resp.locals.lineItem = lineItem;
  }

  resp.locals.order = order[0];

  return next();
};

const findLineItem = async (
  sessionId: string,
  orderItemId: string,
  startingAfter: string | undefined,
  limit: number
): Promise<Stripe.LineItem | undefined> => {
  const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, {
    starting_after: startingAfter,
    limit
  });
  const lineItem = lineItems.data.find((item) => item.price?.metadata.order_item_id === orderItemId);

  if (!lineItem && lineItems.has_more) {
    return findLineItem(sessionId, orderItemId, lineItems.data[lineItems.data.length - 1].id, limit);
  }

  return lineItem;
};
