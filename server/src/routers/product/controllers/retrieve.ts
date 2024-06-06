import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { ProductsInterface } from '../../../../../_shared/types';

export const retrieveProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const offset = req.query.offset?.toString() || '0';
  const { id, parentId, productId } = req.query;
  const params = [];
  const where = [];

  if (!parentId) {
    where.push(`p.parent_id IS NULL`);
  }

  if (id && !parentId) {
    params.push(id);

    where.push(`p.id = $${params.length}`);
  } else if (parentId) {
    params.push(parentId);

    where.push(`p.parent_id = $${params.length}`);

    if (productId) {
      params.push(productId);

      where.push(`p.id = $${params.length}`);
    }
  }

  const products = await database.retrieve<ProductsInterface[]>(
    `WITH
    c AS (
      SELECT
        id,
        name,
        parent_id
      FROM categories AS c
    ),
    a AS (
      SELECT
        a.id,
        a.name
      FROM affiliates AS a
    ),
    pu AS (
      SELECT
        pu.id,
        pu.url,
        pu.country,
        pu.price,
        pu.currency,
        pu.product_id,
        pu.type,
        pu.affiliate_id,
        a.affiliate
      FROM product_urls AS pu
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(a.*) AS affiliate
        FROM a
        WHERE a.id = pu.affiliate_id
      ) AS a ON true
    ),
    pb AS (
      SELECT
        pb.id,
        pb.name,
        pb.url
      FROM product_brands AS pb
    ),
    pr AS (
      SELECT
        p.id,
        p.name,
        p.description,
        p.category_id,
        p.excerpt,
        p.about,
        p.details,
        p.status,
        p.brand_id,
        p.parent_id,
        p.featured
      FROM products AS p
    )
    
    SELECT
      p.id,
      p.name,
      p.description,
      p.category_id,
      p.excerpt,
      p.about,
      p.details,
      p.status,
      p.brand_id,
      p.parent_id,
      p.featured,
      pr.product,
      pb.brand,
      c.category,
      COALESCE(pu.urls, '[]'::JSONB) AS urls
    FROM products AS p
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pb.*) AS brand
      FROM pb
      WHERE pb.id = p.brand_id
    ) AS pb ON true
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(c.*) AS category
      FROM c
      WHERE c.id = p.category_id
    ) AS c ON true
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pu.*) AS urls
      FROM pu
      WHERE pu.product_id = p.id
    ) AS pu ON true
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pr.*) AS product
      FROM pr
      WHERE pr.id = p.parent_id
    ) AS pr ON true`,
    {
      where: where.join(' AND '),
      params,
      limit: '20',
      orderBy: 'p.ordinance',
      offset,
      client
    }
  );

  const count = await database.retrieve<{ count: number }[]>('SELECT COUNT(*)::INT FROM products AS p', {
    where: where.join(' AND '),
    params,
    client
  });

  resp.locals.response = { data: { products, count: count[0].count } };

  return next();
};

/* export const retrieveMarketplaceProducts = async (req: Request, resp: Response, next: NextFunction) => {
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
    pr.id,
    pr.name,
    pr.description,
    pr.excerpt,
    pr.status,
    COALESCE(pu.urls, '[]'::JSONB) AS urls,
    COALESCE(pm.media, '[]'::JSONB) AS media,
    COALESCE(s.specifications, '[]'::JSONB) AS specifications
  FROM products AS pr
  LEFT JOIN LATERAL (
    SELECT JSONB_AGG(pm.*) AS media
    FROM pm
    WHERE pm.product_id = pr.id
  ) AS pm ON true
  LEFT JOIN LATERAL (
    SELECT JSONB_AGG(pu.*) AS urls
    FROM pu
    WHERE pu.product_id = pr.id
    AND pu.variant_id IS NULL
  ) AS pu ON true
  LEFT JOIN LATERAL (
    SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
      'id', s.id,
      'name', s.name,
      'value', s.value
    )) AS specifications
    FROM s
    WHERE s.product_id = pr.id
  ) AS s ON true
  WHERE (pr.category_id)::INT IN (SELECT id FROM p)
  ORDER BY ${orderBy}
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
      pr.id,
      pr.name,
      pr.description,
      pr.excerpt,
      pr.product_id,
      pr.status,
      COALESCE(s.specifications, '[]'::JSONB) AS specifications
    FROM products AS pr
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(JSONB_BUILD_OBJECT(
        'id', s.id,
        'name', s.name,
        'value', s.value
      )) AS specifications
      FROM s
      WHERE s.product_id = pr.id
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
        pu.variant_id,
        a.affiliate
      FROM product_urls AS pu
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(a.*) AS affiliate
        FROM a
        WHERE a.id = pu.affiliate_id
      ) AS a ON true
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
      COALESCE(pm.media, '[]'::JSONB) AS media,
      COALESCE(pv.variants, '[]'::JSONB) AS variants,
      COALESCE(pu.urls, '[]'::JSONB) AS urls
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
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pu.*) AS urls
      FROM pu
      WHERE pu.product_id = p.id
    ) AS pu ON TRUE
    ${type === 'new' ? `WHERE p.created_at > NOW() - INTERVAL '30 days'` : ''}
    ORDER BY p.created_at DESC
    LIMIT 6`,
    [country],
    client
  );

  resp.locals.response = { data: { products } };

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
}; */
