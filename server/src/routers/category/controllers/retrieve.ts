import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveCategories = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const where = [];
  const params = [];
  const { parentId, hasProducts, categoryId, subcategoryId, groupId } = req.query;
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
    where.push(`(JSONB_ARRAY_LENGTH(c1.subcategories) > 0 OR p.product > 0)`);
  }

  const categories = await database.query(
    `WITH
    c2 AS (
      SELECT
        c.id,
        c.name,
        c.status,
        c.parent_id
      FROM categories AS c
      LEFT JOIN LATERAL (
        SELECT COUNT(p.*) AS product
        FROM products AS p
        WHERE p.category_id = c.id
      ) AS p ON true
      ${hasProducts ? `WHERE p.product > 0` : ''}
      ORDER BY c.name
    ),
    c1 AS (
      SELECT
        c.id,
        c.name,
        c.status,
        c.parent_id,
        COALESCE(c2.subcategories, '[]'::JSONB) AS subcategories
      FROM categories AS c
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(c2.*) AS subcategories
        FROM c2
        WHERE c2.parent_id = c.id
      ) AS c2 ON true
      LEFT JOIN LATERAL (
        SELECT COUNT(p.*) AS product
        FROM products AS p
        WHERE p.category_id = c.id
      ) AS p ON true
      ${hasProducts ? `WHERE JSONB_ARRAY_LENGTH(c2.subcategories) > 0 OR p.product > 0` : ''}
      ORDER BY c.name
    )
    
    SELECT
      c.id,
      c.name,
      c.status,
      COALESCE(c1.subcategories, '[]'::JSONB) AS subcategories
    FROM categories AS c
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(c1.*) AS subcategories
      FROM c1
      WHERE c1.parent_id = c.id
    ) AS c1 ON true
    LEFT JOIN LATERAL (
      SELECT COUNT(p.*) AS product
      FROM products AS p
      WHERE p.category_id = c.id
    ) AS p ON true
    ${where.length > 0 ? `WHERE ${where.join(' AND ')}` : ''}
    ORDER BY c.name`,
    params,
    client
  );

  resp.locals.response = { data: { categories } };

  return next();
};
