import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';
import { generateKey } from '../../../../../_shared/utils';

export const createProductSpecification = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, value, variantId, productId } = req.body;

  const specification = await database.create('specifications', ['id', 'name', 'value'], [id, name, value], {
    conflict: {
      columns: 'name, value',
      do: `UPDATE SET updated_at = NOW()`
    },
    client
  });

  if (specification.length) {
    const id = generateKey(1);

    await database.create(
      'product_specifications',
      ['id', 'product_id', 'specification_id', 'variant_id'],
      [id, productId, specification[0].id, variantId || null],
      { client }
    );
  }

  return next();
};
