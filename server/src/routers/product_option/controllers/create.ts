import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { generateKey } from '../../../../../_shared/utils';

export const createOption = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const {
    id,
    name,
    description,
    minimumSelections,
    maximumSelections,
    required,
    productId,
    status,
    selections
  } = req.body.option;

  const option = await database.create(
    'product_options',
    [
      'id',
      'name',
      'description',
      'minimum_selections',
      'maximum_selections',
      'required',
      'product_id',
      'status'
    ],
    [
      id || generateKey(1),
      name,
      description,
      minimumSelections,
      maximumSelections,
      required,
      productId,
      status
    ],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          minimum_selections = EXCLUDED.minimum_selections,
          maximum_selections = EXCLUDED.maximum_selections,
          required = EXCLUDED.required,
          product_id = EXCLUDED.product_id,
          status = EXCLUDED.status,
          updated_at = NOW()`
      },
      client
    }
  );

  if (selections.length) {
    for (const index in selections) {
      const ordinance = parseInt(index) + 1;
      const selection = selections[index];
      const { id, name, description, price, status } = selection;

      await database.create(
        'option_selections',
        ['id', 'name', 'description', 'price', 'option_id', 'status', 'ordinance'],
        [id || generateKey(1), name, description, price, option[0].id, status, ordinance],
        {
          conflict: {
            columns: 'id',
            do: `UPDATE SET
              name = EXCLUDED.name,
              description = EXCLUDED.description,
              price = EXCLUDED.price,
              status = EXCLUDED.status,
              ordinance = EXCLUDED.ordinance,
              updated_at = NOW()`
          },
          client
        }
      );
    }
  }

  return next();
};
