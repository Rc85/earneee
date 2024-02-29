import { generateOptionString } from '.';
import { AffiliatesInterface, DatabaseRetrieveOptions } from '../../../_shared/types';
import { HttpException } from '../utils';
import { db } from '.';
import { resultsToCamelCase } from '../../../_shared/utils';

export const affiliate = {
  retrieve: async (options?: DatabaseRetrieveOptions): Promise<AffiliatesInterface[]> => {
    const database = options?.client || db;
    const statement = `SELECT
      id,
      name,
      url,
      description,
      manager_url,
      logo_url,
      status
    FROM affiliates AS a
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
