import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const createProductSpecification = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, value, variantId } = req.body;

  const specification = await database.create('specifications', ['id', 'name', 'value'], [id, name, value], {
    conflict: {
      columns: 'name, value',
      do: `UPDATE SET updated_at = NOW()`
    },
    client
  });

  if (specification.length) {
    await database.create(
      'product_specifications',
      ['variant_id', 'specification_id'],
      [variantId, specification[0].id],
      { client }
    );
  }

  return next();
};
