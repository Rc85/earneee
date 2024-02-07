import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';
import { OptionSelectionsInterface } from '../../../../../_shared/types';

export const createProductOption = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, name, required, selections, variantId, status } = req.body;

  await database.create(
    'product_options',
    ['id', 'name', 'required', 'variant_id', 'status'],
    [id, name, required, variantId, status],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET name = EXCLUDED.name, required = EXCLUDED.required, status = EXCLUDED.status, updated_at = NOW()`
      },
      client
    }
  );

  if (selections) {
    const selectionIds = selections.map((selection: OptionSelectionsInterface) => selection.id);

    await database.delete('option_selections', { where: 'NOT id = ANY($1)', params: [selectionIds], client });

    for (const index in selections) {
      const ordinance = parseInt(index) + 1;
      const selection = selections[index];

      await database.create(
        'option_selections',
        ['id', 'name', 'price', 'status', 'ordinance', 'option_id'],
        [selection.id, selection.name, selection.price || 0, selection.status, ordinance, id],
        {
          conflict: {
            columns: 'id',
            do: `UPDATE SET name = EXCLUDED.name, price = EXCLUDED.price, status = EXCLUDED.status, ordinance = EXCLUDED.ordinance, updated_at = NOW()`
          },
          client
        }
      );
    }
  }

  return next();
};
