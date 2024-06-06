import { db, generateOptionString } from '../../src/middlewares/database';
import { DatabaseRetrieveOptions, OffersInterface } from '../../../_shared/types';
import { resultsToCamelCase } from '../../../_shared/utils';
import { HttpException } from '../utils';

export const offer = {
  retrieve: async (options?: DatabaseRetrieveOptions): Promise<OffersInterface[]> => {
    const database = options?.client || db;
    const statement = `SELECT
      id,
      name,
      url,
      logo_url,
      logo_path,
      logo_width,
      logo_height,
      status,
      start_date,
      end_date,
      details
    FROM offers AS o
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
