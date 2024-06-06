import { NextFunction, Request, Response } from 'express';
import { database } from '../../../../src/middlewares/database';
import { ProductSpecificationsInterface, ProductVariantsInterface } from '../../../../../_shared/types';

export const retrieveMarketplaceProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { productId, country } = req.query;
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
        pm.path,
        pm.width,
        pm.height,
        pm.variant_id,
        pm.product_id,
        pm.type
      FROM product_media AS pm
      WHERE pm.status = 'enabled'
      ORDER BY pm.ordinance
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
      ) AS os ON true
      ORDER BY po.name
    ),
    a AS (
      SELECT
        a.id,
        a.name,
        a.url,
        a.logo_url
      FROM affiliates AS a
    ),
    pu AS (
      SELECT
        pu.url,
        pu.variant_id,
        pu.country,
        pu.price,
        pu.currency,
        pu.type,
        a.affiliate
      FROM product_urls AS pu
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(a.*) AS affiliate
        FROM a
        WHERE a.id = pu.affiliate_id
      ) AS a ON true
      WHERE pu.country = $2
    ),
    ps AS (
      SELECT
        s.id,
        s.name,
        s.value,
        ps.variant_id,
        ps.product_id
      FROM specifications AS s
      LEFT JOIN product_specifications AS ps
      ON ps.specification_id = s.id
      ORDER BY s.ordinance
    ),
    pv AS (
      SELECT
        pv.id,
        pv.name,
        pv.excerpt,
        pv.description,
        pv.about,
        pv.details,
        pv.product_id,
        pv.price,
        pv.currency,
        pv.status,
        COALESCE(pm.media, '[]'::JSONB) AS media,
        COALESCE(po.options, '[]'::JSONB) AS options,
        COALESCE(ps.specifications, '[]'::JSONB) AS specifications,
        COALESCE(pu.urls, '[]'::JSONB) AS urls
      FROM product_variants AS pv
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(pu.*) AS urls
        FROM pu
        WHERE pu.variant_id = pv.id
      ) AS pu ON true
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(pm.*) AS media
        FROM pm
        WHERE pm.variant_id = pv.id
      ) AS pm ON true
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(po.*) AS options
        FROM po
        WHERE po.variant_id = pv.id
      ) AS po ON true
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(ps.*) AS specifications
        FROM ps
        WHERE ps.variant_id = pv.id
      ) AS ps ON true
      ORDER BY pv.ordinance
    )
    
    SELECT
      p.id,
      p.name,
      p.description,
      p.details,
      p.about,
      p.excerpt,
      p.status,
      ac.ancestors,
      COALESCE(pv.variants, '[]'::JSONB) AS variants,
      COALESCE(pm.media, '[]'::JSONB) AS media,
      COALESCE(ps.specifications, '[]'::JSONB) AS specifications
    FROM products AS p
    LEFT JOIN LATERAL (
      SELECT ac.ancestors, ac.depth FROM ac
      WHERE ac.id = p.category_id
    ) AS ac ON true
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pv.*) AS variants
      FROM pv
      WHERE pv.product_id = p.id
    ) AS pv ON true
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pm.*) AS media
      FROM pm
      WHERE pm.product_id = p.id
      AND pm.variant_id IS NULL
    ) AS pm ON true
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(ps.*) AS specifications
      FROM ps
      WHERE ps.product_id = p.id
      AND ps.variant_id IS NULL
    ) AS ps ON true
    WHERE p.id = $1
    ORDER BY ac.depth desc
    LIMIT 1`,
    [productId, country],
    client
  );

  resp.locals.response = { data: { product: product[0] } };

  return next();
};

export const retrieveMarketplaceVariants = async (req: Request, resp: Response, next: NextFunction) => {
  const { featured, country } = req.query;
  const { client } = resp.locals;
  const limit = req.query.limit?.toString() || undefined;

  const variants = await database.query(
    `WITH
    pm AS (
      SELECT
        pm.id,
        pm.url,
        pm.width,
        pm.height,
        pm.variant_id,
        pm.product_id,
        pm.type
      FROM product_media AS pm
      WHERE pm.status = 'enabled'
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
        pu.variant_id,
        pu.price,
        pu.currency,
        a.affiliate
      FROM product_urls AS pu
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(a.*) AS affiliate
        FROM a
        WHERE a.id = pu.affiliate_id
      ) AS a ON true
      WHERE LOWER(pu.country) = LOWER($2)
      ORDER BY pu.price DESC
    ),
    pr AS (
      SELECT
        pr.id,
        pr.name,
        pr.excerpt,
        pr.category_id,
        pr.created_at,
        COALESCE(pm.media, '[]'::JSONB) AS media
      FROM products AS pr
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(pm.*) AS media
        FROM pm
        WHERE pm.product_id = pr.id
        AND pm.variant_id IS NULL
      ) AS pm ON true
    )

    SELECT
      pv.id,
      pv.name,
      pv.description,
      pv.excerpt,
      pv.product_id,
      pv.status,
      pv.price,
      pv.currency,
      pr.product,
      COALESCE(pm.media, '[]'::JSONB) AS media,
      COALESCE(pu.urls, '[]'::JSONB) AS urls
    FROM product_variants AS pv
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pm.*) AS media
      FROM pm
      WHERE pm.variant_id = pv.id
    ) AS pm ON true
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pr.*) AS product
      FROM pr
      WHERE pr.id = pv.product_id
    ) AS pr ON true
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pu.*) AS urls
      FROM pu
      WHERE pu.variant_id = pv.id
    ) AS pu ON true
    WHERE pv.featured = $1
    ORDER BY pr.product->>'created_at' DESC
    LIMIT $3
    `,
    [featured, country, limit],
    client
  );

  resp.locals.response = { data: { variants } };

  return next();
};

export const retrieveMarketplaceProductSpecifications = async (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  const { client } = resp.locals;
  const { variantId, categoryId } = req.query;
  const params = [];
  const where = [];

  if (variantId) {
    params.push(variantId);

    where.push(`variant_id = $${params.length}`);
  }

  if (categoryId) {
    params.push(categoryId);

    where.push(`prd.category_id IN (SELECT id FROM p)`);
  }

  const specifications = await database.query(
    `WITH RECURSIVE
    p AS (
      SELECT
        id,
        name,
        parent_id
      FROM categories
      ${variantId && categoryId ? 'WHERE id = $2' : categoryId ? 'WHERE id = $1' : ''}
      UNION ALL
      SELECT
        c.id,
        c.name,
        c.parent_id
      FROM categories AS c
      JOIN p ON p.id = c.parent_id
    )
    
    SELECT
      s.id,
      s.name,
      s.value
    FROM specifications AS s
    LEFT JOIN product_specifications AS ps
    ON ps.specification_id = s.id
    LEFT JOIN product_variants AS pv
    ON ps.variant_id = pv.id
    LEFT JOIN products AS prd
    ON ps.product_id = prd.id
    ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY s.ordinance, s.name`,
    params,
    client
  );

  resp.locals.response = { data: { specifications } };

  return next();
};
