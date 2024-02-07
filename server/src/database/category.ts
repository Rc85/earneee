import { db, generateOptionString } from '.';
import { CategoriesInterface, DatabaseRetrieveOptions } from '../../../_shared/types';
import { resultsToCamelCase } from '../../../_shared/utils';
import { HttpException } from '../utils';

export const category = {
  retrieve: async (options?: DatabaseRetrieveOptions): Promise<CategoriesInterface[]> => {
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
  }
};
