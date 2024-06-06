import { db, generateOptionString } from '../../src/middlewares/database';
import { DatabaseRetrieveOptions, UserProfilesInterface, UsersInterface } from '../../../_shared/types';
import { resultsToCamelCase } from '../../../_shared/utils';
import { HttpException } from '../utils';

export const user = {
  retrieve: async (options?: DatabaseRetrieveOptions): Promise<UsersInterface[]> => {
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
    ),
    ub AS (
      SELECT
        ub.id,
        ub.user_id,
        ub.banned_until,
        ub.reason
      FROM user_bans AS ub
      WHERE ub.banned_until > NOW()
      ORDER BY ub.banned_until DESC
      LIMIT 1
    )

    SELECT
      u.id,
      u.email,
      u.is_admin,
      u.status,
      u.created_at,
      up.profile,
      ub.ban
    FROM users AS u
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(up.*) AS profile
      FROM up
      WHERE up.id = u.id
    ) AS up ON true
    LEFT JOIN LATERAL (
      SELECT TO_JSONB(ub.*) AS ban
      FROM ub
      WHERE ub.user_id = u.id
    ) AS ub ON true
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
