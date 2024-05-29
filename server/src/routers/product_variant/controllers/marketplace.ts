import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';
import { ProductSpecificationsInterface, ProductVariantsInterface } from '../../../../../_shared/types';

export const retrieveMarketplaceProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { groupId, subcategoryId, categoryId, country } = req.query;
  const id = groupId || subcategoryId || categoryId;
  const offset = req.query.offset?.toString() || '0';
  const params: any = [id, country];
  const sort = req.query.orderBy?.toString() || 'newest';

  let orderBy = `pr.product->>'created_at' DESC`;

  if (sort === 'newest') {
    orderBy = `pr.product->>'created_at' DESC`;
  } else if (sort === 'oldest') {
    orderBy = `pr.product->>'created_at' ASC`;
  } else if (sort === 'name_asc') {
    orderBy = `pr.product->>'name' ASC`;
  } else if (sort === 'name_desc') {
    orderBy = `pr.product->>'name' DESC`;
  } else if (sort === 'price_asc') {
    orderBy = `pu.price ASC`;
  } else if (sort === 'price_desc') {
    orderBy = `pu.price DESC NULLS LAST`;
  }

  let filters: {
    minPrice: string | undefined;
    maxPrice: string | undefined;
    specifications: {
      [key: string]: ProductSpecificationsInterface[];
    };
  } = { minPrice: undefined, maxPrice: undefined, specifications: {} };

  if (req.query.filters) {
    filters = JSON.parse(JSON.stringify(req.query.filters));
  }

  const statement = `WITH RECURSIVE
  p AS (
    SELECT
      id,
      name,
      parent_id
    FROM categories
    WHERE id = $1
    UNION ALL
    SELECT
      c.id,
      c.name,
      c.parent_id
    FROM categories AS c
    JOIN p ON p.id = c.parent_id
  ),
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
  pu AS (
    SELECT
      pu.url,
      pu.variant_id,
      pu.price,
      pu.currency
    FROM product_urls AS pu
    WHERE LOWER(pu.country) = LOWER($2)
    ORDER BY pu.price DESC
  ),
  s AS (
    SELECT
      s.id,
      s.name,
      s.value,
      ps.variant_id,
      ps.product_id
    FROM specifications AS s
    LEFT JOIN product_specifications AS ps
    ON ps.specification_id = s.id
  ),
  pr AS (
    SELECT
      pr.id,
      pr.name,
      pr.excerpt,
      pr.category_id,
      pr.created_at,
      COALESCE(pm.media, '[]'::JSONB) AS media,
      COALESCE(s.specifications, '[]'::JSONB) AS specifications
    FROM products AS pr
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pm.*) AS media
      FROM pm
      WHERE pm.product_id = pr.id
      AND pm.variant_id IS NULL
    ) AS pm ON true
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
        'id', s.id,
        'name', s.name,
        'value', s.value
      )) AS specifications
      FROM s
      WHERE s.product_id = pr.id
      AND s.variant_id IS NULL
    ) AS s ON true
  )

  SELECT
    pv.id,
    pv.name,
    pv.description,
    pv.excerpt,
    pv.product_id,
    pv.status,
    pr.product,
    pu.price,
    pu.currency,
    COALESCE(pm.media, '[]'::JSONB) AS media,
    COALESCE(s.specifications, '[]'::JSONB) AS specifications
  FROM product_variants AS pv
  LEFT JOIN LATERAL (
    SELECT JSONB_AGG(pm.*) AS media
    FROM pm
    WHERE pm.variant_id = pv.id
  ) AS pm ON true
  LEFT JOIN pu ON pu.variant_id = pv.id
  LEFT JOIN LATERAL (
    SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
      'id', s.id,
      'name', s.name,
      'value', s.value
    )) AS specifications
    FROM s
    WHERE s.variant_id = pv.id
  ) AS s ON true
  LEFT JOIN LATERAL (
    SELECT TO_JSONB(pr.*) AS product
    FROM pr
    WHERE pr.id = pv.product_id
  ) AS pr ON true
  WHERE (pr.product->>'category_id')::INT IN (SELECT id FROM p)
  ORDER BY ${orderBy}, pv.ordinance
  OFFSET ${offset}
  LIMIT 20`;

  const variants: ProductVariantsInterface[] = await database.query(statement, params, client);

  const count = await database.query(
    `WITH RECURSIVE
    p AS (
      SELECT
        id,
        name,
        parent_id
      FROM categories
      WHERE id = $1
      UNION ALL
      SELECT
        c.id,
        c.name,
        c.parent_id
      FROM categories AS c
      JOIN p ON p.id = c.parent_id
    ),
    s AS (
      SELECT
        s.id,
        s.name,
        s.value,
        ps.variant_id,
        ps.product_id
      FROM specifications AS s
      LEFT JOIN product_specifications AS ps
      ON ps.specification_id = s.id
    )

    SELECT
      pv.id,
      pv.name,
      pv.description,
      pv.excerpt,
      pv.product_id,
      pv.status,
      COALESCE(s.specifications, '[]'::JSONB) AS specifications
    FROM product_variants AS pv
    LEFT JOIN products AS pr
    ON pv.product_id = pr.id
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
        'id', s.id,
        'name', s.name,
        'value', s.value
      )) AS specifications
      FROM s
      WHERE s.variant_id = pv.id
    ) AS s ON true
    WHERE pr.category_id IN (SELECT id FROM p)`,
    [id],
    client
  );

  let results = filterBySpecifications(variants, filters.specifications);
  let finalCount = filterBySpecifications(count, filters.specifications);

  if (filters.minPrice || filters.maxPrice) {
    results = filterByPrice(results, filters);

    finalCount = filterByPrice(finalCount, filters);
  }

  resp.locals.response = { data: { variants: results, count: finalCount.length } };

  return next();
};

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
        pv.status,
        pu.price,
        pu.currency,
        pu.country,
        pu.affiliate,
        pu.type,
        pu.url,
        COALESCE(pm.media, '[]'::JSONB) AS media,
        COALESCE(po.options, '[]'::JSONB) AS options,
        COALESCE(ps.specifications, '[]'::JSONB) AS specifications
      FROM product_variants AS pv
      LEFT JOIN pu
      ON pu.variant_id = pv.id
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
    pu AS (
      SELECT
        pu.variant_id,
        pu.price,
        pu.currency
      FROM product_urls AS pu
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

const matchingKeys = (requestedKeys: string[], lookupKeys: string[]) => {
  requestedKeys.sort();
  lookupKeys.sort();

  const matched =
    (requestedKeys.length === lookupKeys.length &&
      JSON.stringify(requestedKeys) === JSON.stringify(lookupKeys)) ||
    (requestedKeys.length < lookupKeys.length && lookupKeys.some((key) => requestedKeys.includes(key)));

  return matched;
};

const filterBySpecifications = (
  variants: ProductVariantsInterface[],
  filters: { [key: string]: ProductSpecificationsInterface[] }
) => {
  const results: ProductVariantsInterface[] = [];

  for (const variant of variants) {
    const specificationFilters = filters && Object.keys(filters).length;

    if (!specificationFilters) {
      results.push(variant);
    } else {
      if (specificationFilters) {
        const specifications = variant.specifications || [];
        const specificationNames = Array.from(
          new Set(specifications.map((specification) => specification.name))
        );
        const filteredSpecificationNames = Array.from(new Set(Object.keys(filters)));

        if (matchingKeys(filteredSpecificationNames, specificationNames)) {
          const matches = [];

          for (const name in filters) {
            let match = false;

            for (const spec of filters[name]) {
              const m = Boolean(specifications.find((s) => s.id === spec.id));

              if (m) {
                match = true;

                break;
              }
            }

            matches.push(match);
          }
          const exist = results.find((v: any) => v.id === variant.id);

          if (!matches.includes(false) && !exist) {
            results.push(variant);
          }
        }
      }
    }
  }

  return results;
};

const filterByPrice = (
  variants: ProductVariantsInterface[],
  filters: { minPrice: string | undefined; maxPrice: string | undefined }
) => {
  return variants.filter(
    (variant) =>
      (!filters.maxPrice && filters.minPrice && (variant.price || 0) >= parseFloat(filters.minPrice)) ||
      (!filters.minPrice && filters.maxPrice && (variant.price || 0) <= parseFloat(filters.maxPrice)) ||
      (filters.minPrice &&
        filters.maxPrice &&
        (variant.price || 0) >= parseFloat(filters.minPrice) &&
        (variant.price || 0) <= parseFloat(filters.maxPrice))
  );
};
