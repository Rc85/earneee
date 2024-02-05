import pg from 'pg';
import { resultsToCamelCase } from '../../../_shared/utils';
import { DatabaseCreateOptions, DatabaseQueryOptions, DatabaseRetrieveOptions } from '../../../_shared/types';
import { affiliates } from './affiliates';
import { categories } from './categories';
import { offers } from './offers';

const config: pg.PoolConfig = {
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  max: 20,
  connectionTimeoutMillis: 20000,
  idleTimeoutMillis: 3000
};

export const db = new pg.Pool(config);

export const database = {
  create: async (tableName: string, columns: string[], params: any[], options?: DatabaseCreateOptions) => {
    const database = options?.client || db;

    let values: string[] = [];

    if (options?.multiple) {
      const { newParams, newValues } = generateMultiInsertParamString(params, columns);

      params = newParams;
      values = newValues;
    }

    const targets = columns.map((value, index) => `$${index + 1}`).join(', ');

    const insertStatement = options?.multiple
      ? `INSERT INTO ${tableName} (${columns}) VALUES ${values.join(', ')}`
      : `INSERT INTO ${tableName} (${columns}) VALUES (${targets})`;

    const statement = `${insertStatement}
		${
      options?.conflict
        ? `ON CONFLICT ${
            options.conflict.columns && options.conflict.columns.length > 0
              ? `(${options.conflict.columns})`
              : ''
          }
        ${options.conflict.where ? `WHERE ${options.conflict.where}` : ''}
        DO ${options.conflict.do}`
        : ''
    }
		RETURNING *`;

    return await database
      .query(statement, params)
      .then((result: any) => {
        return resultsToCamelCase(result.rows);
      })
      .catch((err: any) => {
        console.log(statement);
        console.log(err);

        throw err;
      });
  },
  retrieve: async (tableName: string, options?: DatabaseRetrieveOptions): Promise<any> => {
    const database = options?.client || db;
    const statement = `SELECT ${options?.columns || '*'} FROM ${tableName}
		${options?.where ? `WHERE ${options?.where}` : ''}
		${options?.orderBy ? `ORDER BY ${options?.orderBy}` : ''}
		${options?.offset ? `OFFSET ${options?.offset}` : ''}
		${options?.limit ? `LIMIT ${options?.limit}` : ''}`;

    return await database
      .query(statement, options?.params)
      .then((result: any) => {
        return resultsToCamelCase(result.rows);
      })
      .catch((err: any) => {
        console.log(statement);
        console.log(err);

        throw err;
      });
  },
  update: async (
    tableName: string,
    updateFields: string | string[],
    options?: DatabaseQueryOptions
  ): Promise<any> => {
    const database = options?.client || db;
    const statement = `UPDATE ${tableName} SET ${
      updateFields && updateFields instanceof Array
        ? `${
            updateFields.length > 0
              ? `${updateFields.map((field, i) => `${field} = $${i + 1}`).join(', ')}, `
              : ''
          }`
        : updateFields && typeof updateFields === 'string'
        ? `${updateFields}, `
        : ''
    } updated_at = now()
		${options?.where ? `WHERE ${options?.where}` : ''}
		RETURNING *`;

    return await database
      .query(statement, options?.params)
      .then((result: any) => {
        return resultsToCamelCase(result.rows);
      })
      .catch((err: any) => {
        console.log(statement);
        console.log(err);

        throw err;
      });
  },
  delete: async (tableName: string, options?: DatabaseQueryOptions) => {
    const database = options?.client || db;
    const statement = `DELETE FROM ${tableName}
		${options?.where ? `WHERE ${options.where}` : ''}
		RETURNING *`;

    return await database
      .query(statement, options?.params)
      .then((result: any) => {
        return resultsToCamelCase(result.rows);
      })
      .catch((err: any) => {
        console.log(statement);
        console.log(err);

        throw err;
      });
  },
  count: async (tableName: string, options?: DatabaseRetrieveOptions): Promise<number> => {
    const database = options?.client || db;
    const statement = `SELECT ${options?.columns || ''} COUNT(*)::int
		FROM ${tableName}
		${generateOptionString(options)}`;

    return await database
      .query(statement, options?.params)
      .then((result: any) => {
        return resultsToCamelCase(result.rows)[0].count;
      })
      .catch((err: any) => {
        console.log(statement);
        console.log(err);

        throw err;
      });
  },
  query: async (statement: string, params: any[], client?: any) => {
    const database = client || db;

    return await database
      .query(statement, params)
      .then((result: any) => {
        return resultsToCamelCase(result.rows);
      })
      .catch((err: any) => {
        console.log(statement);
        console.log(err);

        throw err;
      });
  },
  affiliates,
  categories,
  offers
};

const generateMultiInsertParamString = (params: any[], columns: string[]) => {
  let index = 0;
  const newParams: any[] = [];
  const newValues: string[] = [];

  params = resultsToCamelCase(params, true);

  for (const j in params) {
    const str: string[] = [];

    Object.keys(params[j]).map((key) => {
      if (columns.includes(key)) {
        str.push(`$${index + 1}`);
        const i = columns.findIndex((name) => name === key);

        if (i >= 0) {
          const k = parseInt(j);
          const startingAt = columns.length * k;

          newParams[i + startingAt] = params[k][key];

          /* if (startingAt === 0) {
            newParams[i] = params[k][key];
          } else {
            newParams[i + startingAt] = params[k][key];
          } */
        }

        index++;
      }
    });

    newValues.push(`(${str.join(', ')})`);
  }

  return { newParams, newValues };
};

export const generateOptionString = (options?: DatabaseRetrieveOptions) => {
  const str = [];

  if (options?.where) {
    str.push(`WHERE ${options?.where}`);
  }

  if (options?.groupBy) {
    str.push(`GROUP BY ${options?.groupBy}`);
  }

  if (options?.orderBy) {
    str.push(`ORDER BY ${options?.orderBy}`);
  }

  if (options?.offset) {
    str.push(`OFFSET ${options?.offset}`);
  }

  if (options?.limit) {
    str.push(`LIMIT ${options?.limit}`);
  }

  return str.join('\n');
};
