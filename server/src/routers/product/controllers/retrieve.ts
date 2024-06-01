import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const offset = req.query.offset?.toString() || '0';
  const { productId } = req.query;
  const params = [];
  const where = [];

  if (productId) {
    params.push(productId);

    where.push(`p.id = $1`);
  }

  const products = await database.product.retrieve({
    where: where.join(' AND '),
    params,
    limit: '20',
    orderBy: 'p.name',
    offset,
    client
  });

  const count = await database.count('products AS p', { where: where.join(' AND '), params, client });

  resp.locals.response = { data: { products, count } };

  return next();
};

export const retrieveProductShowcase = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { type, country } = req.query;

  const products = await database.query(
    `WITH
    pm AS (
      SELECT
        pm.id,
        pm.url,
        pm.width,
        pm.height,
        pm.variant_id,
        pm.product_id
      FROM product_media AS pm
      ORDER BY pm.created_at
    ),
    pu AS (
      SELECT
        pu.url,
        pu.price,
        pu.currency,
        pu.variant_id
      FROM product_urls AS pu
      WHERE LOWER(pu.country) = LOWER($1)
      ORDER BY pu.created_at
    ),
    pv AS (
      SELECT
        pv.id,
        pv.name,
        pv.price,
        pv.currency,
        pv.description,
        pv.excerpt,
        pv.product_id,
        COALESCE(pm.media, '[]'::JSONB) AS media,
        COALESCE(pu.urls, '[]'::JSONB) AS urls
      FROM product_variants AS pv
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(pm.*) AS media
        FROM pm
        WHERE pm.variant_id = pv.id
      ) AS pm ON TRUE
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(pu.*) AS urls
        FROM pu
        WHERE pu.variant_id = pv.id
      ) AS pu ON TRUE
    )
    
    SELECT
      p.id,
      p.name,
      p.description,
      p.excerpt,
      p.type,
      COALESCE(pm.media, '[]'::JSONB) AS media,
      COALESCE(pv.variants, '[]'::JSONB) AS variants
    FROM products AS p
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pm.*) AS media
      FROM pm
      WHERE pm.product_id = p.id
    ) AS pm ON TRUE
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pv.*) AS variants
      FROM pv
      WHERE pv.product_id = p.id
    ) AS pv ON TRUE
    ${type === 'new' ? `WHERE p.created_at > NOW() - INTERVAL '30 days'` : ''}
    ORDER BY p.created_at DESC
    LIMIT 6`,
    [country],
    client
  );

  console.log(products);

  resp.locals.response = { data: { products } };

  return next();
};
