import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { ProductsInterface } from '../../../../../_shared/types';

export const searchProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { value, category, country } = req.query;
  const offset = req.query.offset?.toString() || '0';
  const params: any = [country];
  const where = [`p.parent_id IS NULL`];

  if (value) {
    const splitBySpaces = value.toString().split(' ');
    const splitByUnderscores = splitBySpaces.map((value) => value.split('_')).flat();
    const splitByDashes = splitByUnderscores.map((value) => value.split('-')).flat();
    const splitByPeriods = splitByDashes.map((value) => value.split('.')).flat();

    params.push(splitByPeriods.join(' '));

    where.push(`(WORD_SIMILARITY(p.name, $${params.length}) > 0.5
    OR pb.brand->>'name' ILIKE '%' || $${params.length} || '%')
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
      ${category ? `WHERE id = $${params.length}` : 'WHERE parent_id IS NULL'}
      UNION ALL
      SELECT
        c.id,
        c.name,
        c.parent_id
      FROM categories AS c
      JOIN pc ON pc.id = c.parent_id
    ),
    pd AS (
      SELECT
        pd.id,
        pd.amount,
        pd.amount_type,
        pd.product_id
      FROM product_discounts AS pd
      WHERE pd.status = 'active'
      AND pd.starts_at <= NOW()
      AND (pd.ends_at IS NULL OR pd.ends_at > NOW())
    ),
    pb AS (
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
        pu.type,
        a.affiliate
      FROM product_urls AS pu
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(a.*) AS affiliate
        FROM a
        WHERE a.id = pu.affiliate_id
      ) AS a ON true
      WHERE pu.country = $1
    )
    
    SELECT
      p.id,
      p.name,
      p.excerpt,
      p.category_id,
      pb.brand,
      pd.discount,
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
    ) AS pu ON true
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pb.*) AS brand
      FROM pb
      WHERE pb.id = p.brand_id
    ) AS pb ON true
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pd.*) AS discount
      FROM pd
      WHERE pd.product_id = p.id
    ) AS pd ON true`,
    {
      where: where.join(' AND '),
      params,
      orderBy: `WORD_SIMILARITY(p.name, $2) DESC`,
      offset,
      limit: '20',
      client
    }
  );

  const count = await database.retrieve<{ count: number }[]>(
    `WITH
    pb AS (
      SELECT
        b.id,
        b.name,
        b.logo_url
      FROM product_brands AS b
    ),
    pu AS (
      SELECT
        pu.url,
        pu.price,
        pu.currency,
        pu.product_id,
        pu.type
      FROM product_urls AS pu
      WHERE pu.country = $1
    )
    
    SELECT
      p.id,
      p.name,
      p.excerpt,
      p.category_id,
      pb.brand
    FROM products AS p
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pb.*) AS brand
      FROM pb
      WHERE pb.id = p.brand_id
    ) AS pb ON true`,
    {
      where: where.join(' AND '),
      params,
      client
    }
  );

  resp.locals.response = { data: { products, count: count[0].count } };

  return next();
};
