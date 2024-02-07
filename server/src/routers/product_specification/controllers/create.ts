import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';
import { HttpException } from '../../../utils';

export const createProductSpecification = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, value, variantId } = req.body;

  await database
    .create('product_specifications', ['id', 'name', 'value', 'variant_id'], [id, name, value, variantId], {
      conflict: {
        columns: 'id',
        do: `UPDATE SET name = EXCLUDED.name, value = EXCLUDED.value, updated_at = NOW()`
      },
      client
    })
    .catch((err) => {
      if (err.constraint === 'product_specifications_uniq_name_variant_id') {
        throw new HttpException(400, `That specification already exist`);
      }
    });

  return next();
};
