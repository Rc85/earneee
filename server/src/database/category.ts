import { db, generateOptionString } from '.';
import { CategoriesInterface, DatabaseRetrieveOptions } from '../../../_shared/types';
import { resultsToCamelCase } from '../../../_shared/utils';
import { HttpException } from '../utils';

export const category = {
  retrieve: {
    1: async (options?: DatabaseRetrieveOptions): Promise<CategoriesInterface[]> => {
      const database = options?.client || db;
      const statement = `SELECT
        id,
        name,
        type,
        status,
        parent_id,
        ordinance
      FROM categories AS c
      ${generateOptionString(options)}`;

      return await database
        .query(statement, options?.params)
        .then((result: any) => {
          return resultsToCamelCase(result.rows);
        })
        .catch((err: any) => {
          console.log(statement);
          console.log(err);

          throw new HttpException(err);
        });
    },
    2: async (options?: DatabaseRetrieveOptions) => {
      const database = options?.client || db;
      const statement = `WITH
      c1 AS (
        SELECT
          c.id,
          c.name,
          c.parent_id
        FROM categories AS c
        LEFT JOIN LATERAL (
          SELECT COUNT(p.*) AS product
          FROM products AS p
          WHERE p.category_id = c.id
        ) AS p ON TRUE
        WHERE p.product > 0
      )
      
      SELECT
        c.id,
        c.name,
        COALESCE(c1.subcategories, '[]'::JSONB) AS subcategories
      FROM categories AS c
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(c1.*) AS subcategories
        FROM c1
        WHERE c1.parent_id = c.id
      ) AS c1 ON TRUE
      LEFT JOIN LATERAL (
        SELECT COUNT(p.*) AS product
        FROM products AS p
        WHERE p.category_id = c.id
      ) AS p ON TRUE
      ${generateOptionString(options)}`;

      return await database
        .query(statement, options?.params)
        .then((result: any) => {
          return resultsToCamelCase(result.rows);
        })
        .catch((err: any) => {
          console.log(statement);
          console.log(err);

          throw new HttpException(err);
        });
    },
    3: async (options?: DatabaseRetrieveOptions) => {
      const database = options?.client || db;
      const statement = `WITH
      c2 AS (
        SELECT
          c.id,
          c.name,
          c.parent_id
        FROM categories AS c
        LEFT JOIN LATERAL (
          SELECT COUNT(p.*) AS product
          FROM products AS p
          WHERE p.category_id = c.id
        ) AS p ON TRUE
		    WHERE p.product > 0
      ),
      c1 AS (
        SELECT
          c.id,
          c.name,
          c.parent_id,
          COALESCE(c2.subcategories, '[]'::JSONB) AS subcategories
        FROM categories AS c
        LEFT JOIN LATERAL (
          SELECT JSONB_AGG(c2.*) AS subcategories
          FROM c2
          WHERE c2.parent_id = c.id
        ) AS c2 ON TRUE
		    LEFT JOIN LATERAL (
          SELECT COUNT(p.*) AS product
          FROM products AS p
          WHERE p.category_id = c.id
        ) AS p ON TRUE
        WHERE JSONB_ARRAY_LENGTH(c2.subcategories) > 0 OR p.product > 0
      )
      
      SELECT
        c.id,
        c.name,
        COALESCE(c1.subcategories, '[]'::JSONB) AS subcategories
      FROM categories AS c
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(c1.*) AS subcategories
        FROM c1
        WHERE c1.parent_id = c.id
      ) AS c1 ON TRUE
      LEFT JOIN LATERAL (
        SELECT COUNT(p.*) AS product
        FROM products AS p
        WHERE p.category_id = c.id
      ) AS p ON TRUE
      ${generateOptionString(options)}`;

      return await database
        .query(statement, options?.params)
        .then((result: any) => {
          return resultsToCamelCase(result.rows);
        })
        .catch((err: any) => {
          console.log(statement);
          console.log(err);

          throw new HttpException(err);
        });
    }
  }
};
