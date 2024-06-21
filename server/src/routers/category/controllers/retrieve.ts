import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { CategoriesInterface, ProductsInterface } from '../../../../../_shared/types';

export const retrieveCategories = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const where = [`c.status = 'available'`];
  const params = [];
  const { parentId, categoryId, subcategoryId, groupId, hasProducts, withAncestors } = req.query;
  const id = groupId || subcategoryId || categoryId;

  if (parentId) {
    params.push(parentId);

    where.push(`c.parent_id = $1`);
  } else if (id) {
    params.push(id);

    where.push(`c.id = $1`);
  } else {
    where.push(`c.parent_id IS NULL`);
  }

  if (hasProducts) {
    where.push(`p.count > 0`);
  }

  const categories = await database.retrieve<CategoriesInterface[]>(
    `${
      withAncestors
        ? `WITH RECURSIVE
        ac AS (
          SELECT
            c.id,
            c.name,
            c.status,
            1::int AS depth,
            (ARRAY[]::JSONB[] || JSONB_BUILD_OBJECT('id', c.id, 'name', c.name)) AS ancestors
          FROM categories AS c
          UNION ALL
          SELECT
            c.id,
            c.name,
            c.status,
            ac.depth + 1 AS depth,
            ac.ancestors || JSONB_BUILD_OBJECT('id', c.id, 'name', c.name)
          FROM categories AS c, ac
          WHERE c.parent_id = ac.id
        )`
        : ''
    }
    
    SELECT
      c.id,
      c.name,
      c.status
      ${withAncestors ? ', ac.ancestors' : ''}
    FROM categories AS c
    LEFT JOIN LATERAL (
      SELECT COUNT(p.*)::INT
      FROM products AS p
      WHERE p.category_id = c.id
      AND p.parent_id IS NULL
    ) AS p ON true
    ${
      withAncestors
        ? `LEFT JOIN LATERAL (
            SELECT ac.ancestors, ac.depth FROM ac
            ${parentId || id ? 'WHERE ac.id = $1' : ''}
            ORDER BY ac.depth DESC
          ) AS ac ON true`
        : ''
    }`,
    { where: where.join(' AND '), orderBy: 'c.name', params, client }
  );

  const filteredCategories: CategoriesInterface[] = [];

  for (const category of categories) {
    if (withAncestors) {
      const index = filteredCategories.findIndex((c) => c.id === category.id);

      if (index >= 0) {
        const ancestors = filteredCategories[index].ancestors || [];
        const categoryAncestors = category.ancestors || [];

        let longestAncestors: CategoriesInterface[] = [];

        if (ancestors.length < categoryAncestors.length) {
          longestAncestors = categoryAncestors;
        } else if (ancestors.length > categoryAncestors.length) {
          longestAncestors = ancestors;
        }

        const filteredAncestors = longestAncestors.filter((ancestor) => ancestor.id !== category.id);

        filteredCategories[index].ancestors = filteredAncestors;
      } else {
        filteredCategories.push(category);
      }
    } else {
      filteredCategories.push(category);
    }
  }

  resp.locals.response = { data: { categories: filteredCategories } };

  return next();
};

export const retrieveMostRecent = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { country } = req.query;

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
      p.category_id,
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
      where: 'p.parent_id IS null AND p.published IS true',
      params: [country],
      orderBy: 'p.created_at DESC',
      client
    }
  );
  const categoryIds = await retrieveProductCategories(products, []);
  const categories: CategoriesInterface[] = [];

  for (const categoryId of categoryIds) {
    const category = await database.retrieve<CategoriesInterface[]>(
      `WITH RECURSIVE
      ac AS (
        SELECT
          c.id,
          c.name,
          c.status,
          1::int AS depth,
          (ARRAY[]::JSONB[] || JSONB_BUILD_OBJECT('id', c.id, 'name', c.name)) AS ancestors
        FROM categories AS c
        UNION ALL
        SELECT
          c.id,
          c.name,
          c.status,
          ac.depth + 1 AS depth,
          ac.ancestors || JSONB_BUILD_OBJECT('id', c.id, 'name', c.name)
        FROM categories AS c, ac
        WHERE c.parent_id = ac.id
      )
      
      SELECT
        c.id,
        c.name,
        a.ancestors
      FROM categories AS c
      LEFT JOIN LATERAL (
        SELECT ac.ancestors
        FROM ac
        WHERE ac.id = c.parent_id
        ORDER BY ac.depth
      ) AS a ON true`,
      { where: 'c.id = $1', params: [categoryId], client }
    );

    category.sort((a, b) => (a.ancestors && b.ancestors && a.ancestors.length > b.ancestors.length ? -1 : 1));

    categories.push(category[0]);
  }

  categories.sort((a, b) =>
    categoryIds.findIndex((id) => a.id === id) < categoryIds.findIndex((id) => b.id === id) ? -1 : 1
  );

  for (const category of categories) {
    const categoryProducts = products.filter((product) => product.categoryId === category.id);

    category.products = categoryProducts.slice(0, 6);
  }

  resp.locals.response = { data: { categories } };

  return next();
};

export const retrieveProductCategories = (products: ProductsInterface[], categoryIds: number[]): number[] => {
  for (const product of products) {
    if (categoryIds.length < 6 && !categoryIds.includes(product.categoryId)) {
      categoryIds.push(product.categoryId);
    }
  }

  products = products.filter((product) => !categoryIds.includes(product.categoryId));

  if (categoryIds.length < 6 && products.length > 0) {
    return retrieveProductCategories(products, categoryIds);
  }

  return categoryIds;
};
