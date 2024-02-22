import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const searchProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { value, category } = req.query;
  const offset = req.query.offset?.toString() || '0';
  const params: any = [];

  if (value) {
    const splitBySpaces = value.toString().split(' ');
    const splitByUnderscores = splitBySpaces.map((value) => value.split('_')).flat();
    const splitByDashes = splitByUnderscores.map((value) => value.split('-')).flat();
    const splitByPeriods = splitByDashes.map((value) => value.split('.')).flat();

    params.push(splitByPeriods.join(' '));
  }

  if (category) {
    params.push(category.toString());
  }

  const variants = await database.query(
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
    a AS (
      SELECT
        a.id,
        a.name,
        a.logo_url
      FROM affiliates AS a
    ),
    p AS (
      SELECT
        p.id,
        p.name,
        p.excerpt,
        p.category_id,
        b.brand,
        a.affiliate
      FROM products AS p
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(b.*) AS brand
        FROM b
        WHERE b.id = p.brand_id
      ) AS b ON true
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(a.*) AS affiliate
        FROM a
        WHERE a.id = p.affiliate_id
      ) AS a ON true
    ),
    pm AS (
      SELECT
        pm.id,
        pm.url,
        pm.variant_id
      FROM product_media AS pm
      ORDER BY pm.ordinance
    )
    
    SELECT
      pv.id,
      pv.name,
      pv.price,
      pv.currency,
      pv.description,
      p.product,
      WORD_SIMILARITY(p.product->>'name', $1) AS product_similarity,
      WORD_SIMILARITY(pv.name, $1) AS variant_similarity,
      COALESCE(pm.media, '[]'::JSONB) AS media
    FROM product_variants AS pv
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(p) AS product
      FROM p
      WHERE p.id = pv.product_id
    ) AS p ON true
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pm.*) AS media
      FROM pm
      WHERE pm.variant_id = pv.id
    ) AS pm ON true
    WHERE (WORD_SIMILARITY(p.product->>'name', $1) > 0.5 OR WORD_SIMILARITY(pv.name, $1) > 0.5 OR p.product->>'name' ILIKE '%' || $1 || '%' OR pv.name ILIKE '%' || $1 || '%')
    ${category ? `AND (p.product->>'category_id')::INT IN (SELECT id FROM pc)` : ''}
    ORDER BY WORD_SIMILARITY(p.product->>'name', $1) DESC, WORD_SIMILARITY(pv.name, $1) DESC
    OFFSET ${offset}
    LIMIT 20`,
    params,
    client
  );

  const count = await database.query(
    `WITH
    b AS (
      SELECT
        b.id,
        b.name,
        b.logo_url
      FROM product_brands AS b
    ),
    a AS (
      SELECT
        a.id,
        a.name,
        a.logo_url
      FROM affiliates AS a
    ),
    p AS (
      SELECT
        p.id,
        p.name,
        p.excerpt,
        p.category_id,
        b.brand,
        a.affiliate
      FROM products AS p
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(b.*) AS brand
        FROM b
        WHERE b.id = p.brand_id
      ) AS b ON true
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(a.*) AS affiliate
        FROM a
        WHERE a.id = p.affiliate_id
      ) AS a ON true
      ${category ? `WHERE p.category_id = $2` : ''}
    )
    
    SELECT
      pv.id,
      pv.name,
      pv.price,
      pv.currency,
      pv.description,
      p.product
    FROM product_variants AS pv
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(p) AS product
      FROM p
      WHERE p.id = pv.product_id
    ) AS p ON true
    WHERE (WORD_SIMILARITY(p.product->>'name', $1) > 0.5 OR WORD_SIMILARITY(pv.name, $1) > 0.5 OR p.product->>'name' ILIKE '%' || $1 || '%' OR pv.name ILIKE '%' || $1 || '%')`,
    params,
    client
  );

  resp.locals.response = { data: { variants, count: count.length } };

  return next();
};
