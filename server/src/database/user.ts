import { db, generateOptionString } from '.';
import { DatabaseRetrieveOptions, UserProfilesInterface } from '../../../_shared/types';
import { resultsToCamelCase } from '../../../_shared/utils';
import { HttpException } from '../utils';

export const user = {
  retrieve: async (options?: DatabaseRetrieveOptions) => {
    const database = options?.client || db;
    const statement = `WITH
    up AS (
      SELECT
        up.id,
        up.first_name,
        up.last_name,
        up.phone_number,
        up.address,
        up.city,
        up.region,
        up.country,
        up.postal_code,
        up.logo_url
      FROM user_profiles AS up
    )

    SELECT
      u.id,
      u.email,
      u.is_admin,
      u.status,
      u.created_at,
      up.profile
    FROM users AS u
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(up.*) AS profile
      FROM up
      WHERE up.id = u.id
    ) AS up ON true
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
  profile: {
    retrieve: async (options?: DatabaseRetrieveOptions): Promise<UserProfilesInterface[]> => {
      const database = options?.client || db;
      const statement = `SELECT
        up.id,
        up.first_name,
        up.last_name,
        up.phone_number,
        up.address,
        up.city,
        up.region,
        up.country,
        up.postal_code,
        up.logo_url,
        u.email
      FROM user_profiles AS up
      LEFT JOIN users AS u
      ON u.id = up.id
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
