import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { generateKey } from '../../../../../_shared/utils';
import { ProductSpecificationsInterface } from '../../../../../_shared/types';

export const createProductSpecification = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { specifications }: { specifications: ProductSpecificationsInterface[] } = req.body;

  for (const spec of specifications) {
    let specification = await database.retrieve<ProductSpecificationsInterface[]>(
      'SELECT * FROM specifications',
      {
        where: 'id = $1 OR (LOWER(name) = LOWER($2) AND LOWER(value) = LOWER($3))',
        params: [spec.id, spec.name, spec.value],
        client
      }
    );

    if (specification.length === 0) {
      specification = await database.create(
        'specifications',
        ['id', 'name', 'value'],
        [spec.id, spec.name, spec.value],
        {
          conflict: {
            columns: 'id',
            do: `UPDATE SET name = EXCLUDED.name, value = EXCLUDED.value, updated_at = NOW()`
          },
          client
        }
      );
    }

    if (specification.length) {
      const params = [spec.productId, specification[0].id];

      const productSpecifications = await database.retrieve<ProductSpecificationsInterface[]>(
        'SELECT * FROM product_specifications',
        {
          where: `product_id = $1 AND specification_id = $2`,
          params,
          client
        }
      );

      if (productSpecifications.length === 0) {
        const id = generateKey(1);

        await database.create(
          'product_specifications',
          ['id', 'product_id', 'specification_id'],
          [id, spec.productId, specification[0].id],
          { client }
        );
      }
    }
  }

  return next();
};
