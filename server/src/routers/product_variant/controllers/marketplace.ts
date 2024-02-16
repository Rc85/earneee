import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveMarketplaceProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { groupId, subcategoryId, categoryId } = req.query;
  const id = groupId || subcategoryId || categoryId;
  const offset = req.query.offset?.toString() || '0';

  const variants = await database.query(
    `WITH RECURSIVE
    p AS (
      SELECT
        id,
        name,
        parent_id
      FROM categories
      where ${groupId ? `id = $1` : subcategoryId ? `id = $1` : `id = $1`}
      UNION ALL
      SELECT
        c.id,
        c.name,
        c.parent_id
      FROM categories AS c
      JOIN p ON p.id = c.parent_id
    ),
    pr AS (
      SELECT
        pr.id,
        pr.name,
        pr.type,
        pr.category_id
      FROM products AS pr
    )

    SELECT
      pv.id,
      pv.name,
      pv.price,
      pv.currency,
      pv.description,
      pv.product_id,
      pv.status,
      pr.product
    FROM product_variants AS pv
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pr.*) AS product
      FROM pr
      WHERE pr.id = pv.product_id
    ) AS pr ON TRUE
    WHERE (pr.product->>'category_id')::INT IN (SELECT id FROM p)
    OFFSET ${offset}
    LIMIT 20`,
    [id],
    client
  );

  const count = await database.query(
    `WITH RECURSIVE
    p AS (
      SELECT
        id,
        name,
        parent_id
      FROM categories
      where ${groupId ? `id = $1` : subcategoryId ? `id = $1` : `id = $1`}
      UNION ALL
      SELECT
        c.id,
        c.name,
        c.parent_id
      FROM categories AS c
      JOIN p ON p.id = c.parent_id
    )

    SELECT
      pv.id,
      pv.name,
      pv.price,
      pv.description,
      pv.product_id,
      pv.status,
      pr.product
    FROM product_variants AS pv
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(p.*) AS product
      FROM products AS p
      WHERE p.id = pv.product_id
    ) AS pr ON TRUE
    WHERE (pr.product->>'category_id')::INT IN (SELECT id FROM p)`,
    [id],
    client
  );

  resp.locals.response = { data: { variants, count: count.length } };

  return next();
};

export const retrieveMarketplaceProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { id } = req.params;
  const { client } = resp.locals;

  const product = await database.query(
    `WITH RECURSIVE
    ac AS (
      SELECT
        c.id,
        c.name,
        1::int AS depth,
        (ARRAY[]::JSONB[] || JSONB_BUILD_OBJECT('id', c.id, 'name', c.name)) AS ancestors
      FROM categories AS c
      UNION ALL
      SELECT
        c.id,
        c.name,
        ac.depth + 1 AS depth,
        ac.ancestors || JSONB_BUILD_OBJECT('id', c.id, 'name', c.name)
      FROM categories AS c, ac
      WHERE c.parent_id = ac.id
    ),
    pm AS (
      SELECT
        pm.id,
        pm.url,
        pm.width,
        pm.height,
        pm.variant_id,
        pm.type
      FROM product_media AS pm
      WHERE pm.status = 'enabled'
    ),
    os AS (
      SELECT
        os.id,
        os.name,
        os.price,
        os.option_id,
        os.status
      FROM option_selections AS os
      ORDER BY os.ordinance
    ),
    po AS (
      SELECT
        po.id,
        po.name,
        po.variant_id,
        COALESCE(os.selections, '[]'::JSONB) AS selections
      FROM product_options AS po
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(os.*) AS selections
        FROM os
        WHERE os.option_id = po.id
      ) AS os ON TRUE
      ORDER BY po.name
    ),
    pu AS (
      SELECT
        pu.id,
        pu.url,
        pu.variant_id,
        pu.country
      FROM product_urls AS pu
    ),
    pv AS (
      SELECT
        pv.id,
        pv.name,
        pv.price,
        pv.currency,
        pv.description,
        pv.product_id,
        pv.status,
        COALESCE(pm.media, '[]'::JSONB) AS media,
        COALESCE(po.options, '[]'::JSONB) AS options,
        COALESCE(ps.specifications, '[]'::JSONB) AS specifications,
        COALESCE(pu.urls, '[]'::JSONB) AS urls
      FROM product_variants AS pv
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(pm.*) AS media
        FROM pm
        WHERE pm.variant_id = pv.id
      ) AS pm ON TRUE
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(po.*) AS options
        FROM po
        WHERE po.variant_id = pv.id
      ) AS po ON TRUE
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(ps.*) AS specifications
        FROM ps
        WHERE ps.variant_id = pv.id
      ) AS ps ON TRUE
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(pu.*) AS urls
        FROM pu
        WHERE pu.variant_id = pv.id
      ) AS pu ON TRUE
      ORDER BY pv.ordinance
    ),
    ps AS (
      SELECT
        ps.id,
        ps.name,
        ps.value,
        ps.variant_id
      FROM product_specifications AS ps
      ORDER BY ps.ordinance
    )
    
    SELECT
      p.id,
      p.name,
      p.description,
      p.excerpt,
      p.status,
      p.type,
      ac.ancestors,
      COALESCE(pv.variants, '[]'::JSONB) AS variants
    FROM products AS p
    LEFT JOIN LATERAL (
      SELECT ac.ancestors, ac.depth FROM ac
      WHERE ac.id = p.category_id
    ) AS ac ON TRUE
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pv.*) AS variants
      FROM pv
      WHERE pv.product_id = p.id
    ) AS pv ON TRUE
    WHERE p.id = $1
    ORDER BY ac.depth desc
    LIMIT 1`,
    [id],
    client
  );

  resp.locals.response = { data: { product: product[0] } };

  return next();
};
