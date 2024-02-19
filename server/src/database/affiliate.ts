import { generateOptionString } from '.';
import { AffiliatesInterface, DatabaseRetrieveOptions } from '../../../_shared/types';
import { HttpException } from '../utils';
import { db } from '.';
import { resultsToCamelCase } from '../../../_shared/utils';

export const affiliate = {
  retrieve: async (options?: DatabaseRetrieveOptions): Promise<AffiliatesInterface[]> => {
    const database = options?.client || db;
    const statement = `WITH
    au AS (
      SELECT
        id,
        url,
        country,
        affiliate_id
      FROM affiliate_urls AS au
      ORDER BY country
    )

    SELECT
      id,
      name,
      description,
      manager_url,
      logo_url,
      commission_rate,
      rate_type,
      status,
      COALESCE(u.urls, '[]'::JSONB) AS urls
    FROM affiliates AS a
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(au.*) AS urls
      FROM au
      WHERE au.affiliate_id = a.id
    ) AS u ON true
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
};
