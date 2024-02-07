import { db, generateOptionString } from '.';
import {
  DatabaseRetrieveOptions,
  ProductBrandsInterface,
  ProductOptionsInterface,
  ProductVariantsInterface,
  ProductsInterface
} from '../../../_shared/types';
import { resultsToCamelCase } from '../../../_shared/utils';
import { HttpException } from '../utils';

export const product = {
  retrieve: async (options?: DatabaseRetrieveOptions): Promise<ProductsInterface[]> => {
    const database = options?.client || db;
    const statement = `WITH
    c AS (
      SELECT
        id,
        name,
        parent_id
      FROM categories AS c
    )
    
    SELECT
      p.id,
      p.name,
      p.description,
      p.category_id,
      p.excerpt,
      p.status,
      p.type,
      p.affiliate_id,
      p.brand_id,
      c.category
    FROM products AS p
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(c.*) AS category
      FROM c
      WHERE c.id = p.category_id
    ) AS c ON TRUE
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
  brand: {
    retrieve: async (options?: DatabaseRetrieveOptions): Promise<ProductBrandsInterface[]> => {
      const database = options?.client || db;
      const statement = `WITH
      pbu AS (
        SELECT
          pbu.id,
          pbu.url,
          pbu.brand_id,
          pbu.country
        FROM product_brand_urls AS pbu
      )

      SELECT
        pb.id,
        pb.name,
        pb.logo_url,
        pb.logo_path,
        pb.status,
        pb.owner,
        COALESCE(pbu.urls, '[]'::JSONB) AS urls
      FROM product_brands AS pb
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(pbu.*) AS urls
        FROM pbu
        WHERE pbu.brand_id = pb.id
      ) AS pbu ON TRUE
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
  },
  variant: {
    retrieve: async (options?: DatabaseRetrieveOptions): Promise<ProductVariantsInterface[]> => {
      const database = options?.client || db;
      const statement = `WITH
      pm AS (
        SELECT
          pm.id,
          pm.url,
          pm.path,
          pm.type,
          pm.width,
          pm.height,
          pm.variant_id,
          pm.status
        FROM product_media AS pm
        ORDER BY pm.ordinance
      )

      SELECT
        pv.id,
        pv.name,
        pv.description,
        pv.price,
        pv.featured,
        pv.product_id,
        pv.status,
        COALESCE(m.media, '[]'::JSONB) AS media
      FROM product_variants AS pv
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(pm.*) AS media
        FROM pm
        WHERE pm.variant_id = pv.id
      ) AS m ON TRUE
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
  },
  option: {
    retrieve: async (options?: DatabaseRetrieveOptions): Promise<ProductOptionsInterface[]> => {
      const database = options?.client || db;
      const statement = `WITH
      s AS (
        SELECT
          s.id,
          s.name,
          s.price,
          s.option_id,
          s.status
        FROM option_selections AS s
        ORDER BY s.ordinance
      )

      SELECT
        po.id,
        po.name,
        po.required,
        po.variant_id,
        po.status,
        COALESCE(s.selections, '[]'::JSONB) AS selections
      FROM product_options AS po
      LEFT JOIN LATERAL (
        SELECT JSONB_AGG(s.*) AS selections
        FROM s
        WHERE s.option_id = po.id
      ) AS s ON TRUE
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
