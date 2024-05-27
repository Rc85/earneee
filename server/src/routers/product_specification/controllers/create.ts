import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';
import { generateKey } from '../../../../../_shared/utils';

export const createProductSpecification = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, value, variantId, productId } = req.body;

  const specification = await database.create('specifications', ['id', 'name', 'value'], [id, name, value], {
    conflict: {
      columns: 'id',
      do: `UPDATE SET name = EXCLUDED.name, value = EXCLUDED.value, updated_at = NOW()`
    },
    client
  });

  if (specification.length) {
    const params = [productId, specification[0].id];

    if (variantId) {
      params.push(variantId);
    }

    const productSpecifications = await database.retrieve('product_specifications', {
      where: `product_id = $1 AND specification_id = $2 AND ${
        variantId ? `variant_id = $3` : 'variant_id IS NULL'
      }`,
      params,
      client
    });

    if (productSpecifications.length === 0) {
      const id = generateKey(1);

      await database.create(
        'product_specifications',
        ['id', 'product_id', 'specification_id', 'variant_id'],
        [id, productId, specification[0].id, variantId || null],
        { client }
      );
    }
  }

  return next();
};
