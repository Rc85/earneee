import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { ProductsInterface } from '../../../../../_shared/types';

export const searchProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { value, category } = req.query;
  const offset = req.query.offset?.toString() || '0';
  const params: any = [];
  const where = [];

  if (value) {
    const splitBySpaces = value.toString().split(' ');
    const splitByUnderscores = splitBySpaces.map((value) => value.split('_')).flat();
    const splitByDashes = splitByUnderscores.map((value) => value.split('-')).flat();
    const splitByPeriods = splitByDashes.map((value) => value.split('.')).flat();

    params.push(splitByPeriods.join(' '));

    where.push(`(WORD_SIMILARITY(p.name, $${params.length}) > 0.5
    OR b.brand->>'name' ILIKE '%' || $${params.length} || '%')
    ${category ? `AND (p.category_id)::INT IN (SELECT id FROM pc)` : ''}`);
  }

  if (category) {
    params.push(category.toString());

    where.push(`p.category_id = $${params.length}`);
  }

  const products = await database.retrieve<ProductsInterface[]>(
    `WITH RECURSIVE
    pc AS (
      SELECT
        id,
        name,
        parent_id
      FROM categories
      ${category ? 'WHERE id = $2' : 'WHERE parent_id IS NULL'}
      UNION ALL
      SELECT
        c.id,
        c.name,
        c.parent_id
      FROM categories AS c
      JOIN pc ON pc.id = c.parent_id
    ),
    b AS (
      SELECT
        b.id,
        b.name,
        b.logo_url
      FROM product_brands AS b
    ),
    pm AS (
      SELECT
        pm.id,
        pm.url,
        pm.product_id
      FROM product_media AS pm
      ORDER BY pm.ordinance
    ),
    a AS (
      SELECT
        a.id,
        a.name
      FROM affiliates AS a
    ),
    pu AS (
      SELECT
        pu.url,
        pu.price,
        pu.currency,
        pu.product_id,
        a.affiliate
      FROM product_urls AS pu
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(a.*) AS affiliate
        FROM a
        WHERE a.id = pu.affiliate_id
      ) AS a ON true
    )
    
    SELECT
      p.id,
      p.name,
      p.excerpt,
      p.category_id,
      p.type,
      b.brand,
      COALESCE(pm.media, '[]'::JSONB) AS media,
      COALESCE(pu.urls, '[]'::JSONB) AS urls
    FROM products AS p
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pm.*) AS media
      FROM pm
      WHERE pm.product_id = p.id
    ) AS pm ON true
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pu.*) AS urls
      FROM pu
      WHERE pu.product_id = p.id
    ) AS pu ON true`,
    {
      where: where.join(' AND '),
      params,
      orderBy: `WORD_SIMILARITY(p.name, $1) DESC`,
      offset,
      limit: '20',
      client
    }
  );

  const count = await database.retrieve<number>(
    `WITH
    b AS (
      SELECT
        b.id,
        b.name,
        b.logo_url
      FROM product_brands AS b
    ),
    p AS (
      SELECT
        p.id,
        p.name,
        p.excerpt,
        p.category_id,
        b.brand
      FROM products AS p
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(b.*) AS brand
        FROM b
        WHERE b.id = p.brand_id
      ) AS b ON true
      ${category ? `WHERE p.category_id = $2` : ''}
    )
    
    SELECT
      pv.id,
      pv.name,
      pv.price,
      pv.currency,
      pv.description,
      pv.excerpt,
      p.product
    FROM product_variants AS pv
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(p) AS product
      FROM p
      WHERE p.id = pv.product_id
    ) AS p ON true`,
    {
      where: where.join(' AND '),
      params,
      client
    }
  );

  resp.locals.response = { data: { products, count } };

  return next();
};
