import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import {
  ProductSpecificationsInterface,
  ProductUrlsInterface,
  ProductsInterface
} from '../../../../../_shared/types';

export const retrieveProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const offset = req.query.offset?.toString() || '0';
  const { id, parentId } = req.query;
  const params = [];
  const where = [];

  if (id) {
    params.push(id);

    where.push(`p.id = $${params.length}`);
  }

  if (parentId) {
    params.push(parentId);

    where.push(`p.parent_id = $${params.length}`);
  } else {
    where.push(`p.parent_id IS NULL`);
  }

  const products = await database.retrieve<ProductsInterface[]>(
    `WITH
    pd AS (
      SELECT * FROM product_discounts AS pd
      WHERE pd.starts_at <= NOW()
    ),
    pu AS (
      SELECT
        pu.*,
        a.affiliate,
        COALESCE(pd.discounts, '[]') AS discounts
      FROM product_urls AS pu
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(a.*) AS affiliate
        FROM affiliates AS a
        WHERE a.id = pu.affiliate_id
      ) AS a ON true
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(pd.*) AS discounts
        FROM pd
        WHERE pd.product_url_id = pu.id
      ) AS pd ON true
    )
    
    SELECT
      p.*,
      pb.brand,
      c.category,
      pr.product,
      COALESCE(v.variants, '[]'::JSONB) AS variants,
      COALESCE(pu.urls, '[]'::JSONB) AS urls
    FROM products AS p
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pb.*) AS brand
      FROM product_brands AS pb
      WHERE pb.id = p.brand_id
    ) AS pb ON true
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(c.*) AS category
      FROM categories AS c
      WHERE c.id = p.category_id
    ) AS c ON true
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pu.*) AS urls
      FROM pu
      WHERE pu.product_id = p.id
    ) AS pu ON true
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pr.*) AS variants
      FROM products AS pr
      WHERE pr.parent_id = p.id
    ) AS v ON true
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pr.*) AS product
      FROM products AS pr
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

export const retrieveMarketplaceProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { groupId, subcategoryId, categoryId, country, featured } = req.query;
  const id = groupId || subcategoryId || categoryId;
  const offset = req.query.offset?.toString() || '0';
  const limit = req.query.limit?.toString() || '20';
  const params: any = [country];
  const where = [
    `(pr.category_id)::INT IN (SELECT id FROM p)`,
    `pr.parent_id IS NULL`,
    `pr.published IS true`
  ];
  const sort = req.query.orderBy?.toString() || 'newest';

  if (featured) {
    where.push(`pr.featured IS true`);
  }

  if (id) {
    params.push(id);
  }

  let orderBy = `pr.created_at DESC`;

  if (sort === 'newest') {
    orderBy = `pr.created_at DESC`;
  } else if (sort === 'oldest') {
    orderBy = `pr.created_at ASC`;
  } else if (sort === 'name_asc') {
    orderBy = `pr.name ASC`;
  } else if (sort === 'name_desc') {
    orderBy = `pr.name DESC`;
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
    ${id ? `WHERE id = $2` : ''}
    UNION ALL
    SELECT
      c.id,
      c.name,
      c.parent_id
    FROM categories AS c
    JOIN p ON p.id = c.parent_id
  ),
  pd AS (
    SELECT
      pd.id,
      pd.amount,
      pd.amount_type,
      pd.product_url_id,
      pd.limited_time_only
    FROM product_discounts AS pd
    WHERE pd.status = 'active'
    AND pd.starts_at <= NOW()
    AND (pd.ends_at IS NULL OR pd.ends_at >= NOW())
  ),
  pm AS (
    SELECT
      pm.id,
      pm.url,
      pm.width,
      pm.height,
      pm.product_id,
      pm.type,
      pm.sizing,
      pm.use_as_thumbnail
    FROM product_media AS pm
    WHERE pm.status = 'enabled'
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
      pu.product_id,
      pu.price,
      pu.currency,
      pu.type,
      a.affiliate,
      pd.discount
    FROM product_urls AS pu
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(a.*) AS affiliate
      FROM a
      WHERE a.id = pu.affiliate_id
    ) AS a ON true
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pd.*) AS discount
      FROM pd
      WHERE pd.product_url_id = pu.id
    ) AS pd ON true
    WHERE LOWER(pu.country) = LOWER($1)
    ORDER BY pu.price DESC
  ),
  s AS (
    SELECT
      s.id,
      s.name,
      s.value,
      ps.product_id
    FROM specifications AS s
    LEFT JOIN product_specifications AS ps
    ON ps.specification_id = s.id
  ),
  v AS (
    SELECT
      pr.id,
      pr.name,
      pr.parent_id,
      COALESCE(pm.media, '[]'::JSONB) AS media
    FROM products AS pr
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pm.*) AS media
      FROM pm
      WHERE pm.product_id = pr.id
    ) AS pm ON true
  ),
  pb AS (
    SELECT
      pb.id,
      pb.name
    FROM product_brands AS pb
  )

  SELECT
    pr.id,
    pr.name,
    pr.description,
    pr.excerpt,
    pr.status,
    pb.brand,
    pu.url,
    COALESCE(v.variants, '[]'::JSONB) AS variants,
    COALESCE(pm.media, '[]'::JSONB) AS media,
    COALESCE(s.specifications, '[]'::JSONB) AS specifications
  FROM products AS pr
  LEFT JOIN LATERAL (
    SELECT TO_JSONB(pb.*) AS brand
    FROM pb
    WHERE pb.id = pr.brand_id
  ) AS pb ON true
  LEFT JOIN LATERAL (
    SELECT JSONB_AGG(pm.*) AS media
    FROM pm
    WHERE pm.product_id = pr.id
  ) AS pm ON true
  LEFT JOIN LATERAL (
    SELECT TO_JSONB(pu.*) AS url
    FROM pu
    WHERE pu.product_id = pr.id
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
  LEFT JOIN LATERAL (
    SELECT JSONB_AGG(v.*) AS variants
    FROM v
    WHERE v.parent_id = pr.id
  ) AS v ON true`;

  const products = await database.retrieve<ProductsInterface[]>(statement, {
    where: where.join(' AND '),
    params,
    orderBy,
    limit,
    offset,
    client
  });

  const count = await database.retrieve<ProductsInterface[]>(
    `WITH RECURSIVE
    p AS (
      SELECT
        id,
        name,
        parent_id
      FROM categories
      ${id ? `WHERE id = $1` : ''}
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
    ) AS s ON true`,
    { where: where.join(' AND '), params: id ? [id] : [], client }
  );

  let results = filterBySpecifications(products, filters.specifications);
  let finalCount = filterBySpecifications(count, filters.specifications);

  if (filters.minPrice || filters.maxPrice) {
    results = filterByPrice(results, filters);

    finalCount = filterByPrice(finalCount, filters);
  }

  if (sort === 'price_asc') {
    results.sort((a, b) => ((a.urls?.[0]?.price || 0) < (b.urls?.[0]?.price || 0) ? -1 : 1));
  } else if (sort === 'price_desc') {
    results.sort((a, b) => ((a.urls?.[0]?.price || 0) > (b.urls?.[0]?.price || 0) ? -1 : 1));
  }

  resp.locals.response = { data: { products: results, count: finalCount.length } };

  return next();
};

export const retrieveProductShowcase = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { type, country } = req.query;
  const where = [`p.parent_id IS NULL`, `p.published IS true`];

  if (type === 'new') {
    where.push(`p.created_at > NOW() - INTERVAL '30 days'`);
  }

  const products = await database.retrieve<ProductsInterface[]>(
    `WITH
    pd AS (
      SELECT
        pd.id,
        pd.amount,
        pd.amount_type,
        pd.product_url_id,
        pd.limited_time_only
      FROM product_discounts AS pd
      WHERE pd.status = 'active'
      AND pd.starts_at <= NOW()
      AND (pd.ends_at IS NULL OR pd.ends_at >= NOW())
    ),
    pm AS (
      SELECT
        pm.id,
        pm.url,
        pm.width,
        pm.height,
        pm.product_id,
        pm.sizing,
        pm.use_as_thumbnail
      FROM product_media AS pm
      WHERE pm.status = 'enabled'
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
        pu.type,
        a.affiliate,
        pd.discount
      FROM product_urls AS pu
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(a.*) AS affiliate
        FROM a
        WHERE a.id = pu.affiliate_id
      ) AS a ON true
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(pd.*) AS discount
        FROM pd
        WHERE pd.product_url_id = pu.id
      ) AS pd ON true
      WHERE LOWER(pu.country) = LOWER($1)
      ORDER BY pu.created_at
    ),
    pb AS (
      SELECT
        pb.id,
        pb.name
      FROM product_brands AS pb
    ),
    v AS (
      SELECT
        pr.id,
        pr.name,
        pr.parent_id,
        COALESCE(pm.media, '[]'::JSONB) AS media
      FROM products AS pr
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(pm.*) AS media
        FROM pm
        WHERE pm.product_id = pr.id
      ) AS pm ON true
    )
    
    SELECT
      p.id,
      p.name,
      p.description,
      p.excerpt,
      pb.brand,
      pu.url,
      COALESCE(v.variants, '[]'::JSONB) AS variants,
      COALESCE(pm.media, '[]'::JSONB) AS media
    FROM products AS p
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pb.*) AS brand
      FROM pb
      WHERE pb.id = p.brand_id
    ) AS pb ON true
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(pm.*) AS media
      FROM pm
      WHERE pm.product_id = p.id
    ) AS pm ON true
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pu.*) AS url
      FROM pu
      WHERE pu.product_id = p.id
    ) AS pu ON true
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(v.*) AS variants
      FROM v
      WHERE v.parent_id = p.id
    ) AS v ON true`,
    {
      where: where.join(' AND '),
      params: [country],
      orderBy: `p.created_at DESC`,
      limit: '6',
      client
    }
  );

  resp.locals.response = { data: { products } };

  return next();
};

export const retrieveMarketplaceProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { productId, country } = req.query;

  const product = await database.retrieve<ProductUrlsInterface[]>(
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
    ps AS (
      SELECT
        s.id,
        s.name,
        s.value,
        ps.product_id
      FROM product_specifications AS ps
      LEFT JOIN specifications AS s
      ON s.id = ps.specification_id
    ),
    pd AS (
      SELECT
        pd.id,
        pd.amount,
        pd.amount_type,
        pd.product_url_id,
        pd.limited_time_only,
        pd.starts_at,
        pd.ends_at
      FROM product_discounts AS pd
      WHERE pd.status = 'active'
      AND pd.starts_at <= NOW()
      AND (pd.ends_at IS NULL OR pd.ends_at >= NOW())
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
        pu.shipping_time,
        pu.refund_time,
        a.affiliate,
        pd.discount
      FROM product_urls AS pu
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(a.*) AS affiliate
        FROM a
        WHERE a.id = pu.affiliate_id
      ) AS a ON true
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(pd.*) AS discount
        FROM pd
        WHERE pd.product_url_id = pu.id
      ) AS pd ON true
      WHERE LOWER(pu.country) = LOWER($1)
      ORDER BY pu.created_at
    ),
    pm AS (
      SELECT
        pm.id,
        pm.url,
        pm.product_id,
        pm.url,
        pm.path,
        pm.width,
        pm.height,
        pm.type,
        pm.sizing,
        pm.use_as_thumbnail
      FROM product_media AS pm
      WHERE pm.status = 'enabled'
      ORDER BY pm.ordinance, pm.created_at
    ),
    pb AS (
      SELECT
        pb.id,
        pb.name,
        pb.logo_url
      FROM product_brands AS pb
    ),
    os AS (
      SELECT
        os.id,
        os.name,
        os.price,
        os.option_id
      FROM option_selections AS os
      WHERE os.status = 'available'
    ),
    po AS (
      SELECT
        po.id,
        po.name,
        po.description,
        po.product_id,
        po.minimum_selections,
        po.maximum_selections,
        po.required,
        COALESCE(os.selections, '[]'::JSONB) AS selections
      FROM product_options AS po
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(os.*) AS selections
        FROM os
        WHERE os.option_id = po.id
      ) AS os ON true
      WHERE po.status = 'available'
    ),
    pr AS (
      SELECT
        pr.id,
        pr.name,
        pr.parent_id,
        pr.description,
        pr.excerpt,
        pr.details,
        pr.about,
        pr.status,
        pu.url,
        COALESCE(po.options, '[]'::JSONB) AS options,
        COALESCE(ps.specifications, '[]'::JSONB) AS specifications,
        COALESCE(pm.media, '[]'::JSONB) AS media
      FROM products AS pr
      LEFT JOIN LATERAL(
        SELECT JSONB_AGG(pm.*) AS media
        FROM pm
        WHERE pm.product_id = pr.id
      ) AS pm ON true
      LEFT JOIN LATERAL(
        SELECT JSONB_AGG(ps.*) AS specifications
        FROM ps
        WHERE ps.product_id = pr.id
      ) AS ps ON true
      LEFT JOIN LATERAL (
        SELECT TO_JSONB(pu.*) AS url
        FROM pu
        WHERE pu.product_id = pr.id
      ) AS pu ON true
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(po.*) AS options
        FROM po
        WHERE po.product_id = pr.id
      ) AS po ON true
      ORDER BY pr.ordinance
    )
    
    SELECT
      p.id,
      p.name,
      p.parent_id,
      p.description,
      p.excerpt,
      p.details,
      p.review,
      p.about,
      p.status,
      pb.brand,
      pu.url,
      ac.ancestors,
      COALESCE(po.options, '[]'::JSONB) AS options,
      COALESCE(pr.variants, '[]'::JSONB) AS variants,
      COALESCE(ps.specifications, '[]'::JSONB) AS specifications,
      COALESCE(pm.media, '[]'::JSONB) AS media
    FROM products AS p
    LEFT JOIN LATERAL (
      SELECT ac.ancestors, ac.depth FROM ac
      WHERE ac.id = p.category_id
      ORDER BY ac.depth DESC
    ) AS ac ON true
    LEFT JOIN LATERAL(
      SELECT JSONB_AGG(pm.*) AS media
      FROM pm
      WHERE pm.product_id = p.id
    ) AS pm ON true
    LEFT JOIN LATERAL(
      SELECT JSONB_AGG(ps.*) AS specifications
      FROM ps
      WHERE ps.product_id = p.id
    ) AS ps ON true
    LEFT JOIN LATERAL(
      SELECT JSONB_AGG(pr.*) AS variants
      FROM pr
      WHERE pr.parent_id = p.id
    ) AS pr ON true
    LEFT JOIN LATERAL(
      SELECT TO_JSONB(pb.*) AS brand
      FROM pb
      WHERE pb.id = p.brand_id
    ) AS pb ON true
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(pu.*) AS url
      FROM pu
      WHERE pu.product_id = p.id
    ) AS pu ON true
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(po.*) AS options
      FROM po
      WHERE po.product_id = p.id
    ) AS po ON true`,
    {
      where: `p.id = $2 AND p.published IS true`,
      params: [country, productId],
      client
    }
  );

  resp.locals.response = { data: { product: product[0] } };

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
  products: ProductsInterface[],
  filters: { [key: string]: ProductSpecificationsInterface[] }
) => {
  const results: ProductsInterface[] = [];

  for (const product of products) {
    const specificationFilters = filters && Object.keys(filters).length;

    if (!specificationFilters) {
      results.push(product);
    } else {
      if (specificationFilters) {
        const specifications = product.specifications || [];
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
          const exist = results.find((p: any) => p.id === product.id);

          if (!matches.includes(false) && !exist) {
            results.push(product);
          }
        }
      }
    }
  }

  return results;
};

const filterByPrice = (
  products: ProductsInterface[],
  filters: { minPrice: string | undefined; maxPrice: string | undefined }
) => {
  return products.filter((product) => {
    const price = product.url?.price || 0;

    return (
      (!filters.maxPrice && filters.minPrice && price >= parseFloat(filters.minPrice)) ||
      (!filters.minPrice && filters.maxPrice && price <= parseFloat(filters.maxPrice)) ||
      (filters.minPrice &&
        filters.maxPrice &&
        price >= parseFloat(filters.minPrice) &&
        price <= parseFloat(filters.maxPrice))
    );
  });
};
