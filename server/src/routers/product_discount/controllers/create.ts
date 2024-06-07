import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { generateKey } from '../../../../../_shared/utils';

export const createProductDiscount = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { discount } = req.body;
  const { id, amount, amountType, productId, status, startsAt, endsAt, limitedTimeOnly } = discount;

  await database.create(
    'product_discounts',
    ['id', 'amount', 'amount_type', 'product_id', 'status', 'starts_at', 'ends_at', 'limited_time_only'],
    [
      id || generateKey(1),
      amount || 0,
      amountType || 'fixed',
      productId,
      status || 'active',
      startsAt || null,
      endsAt || null,
      Boolean(limitedTimeOnly)
    ],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          id = EXCLUDED.id,
          amount = EXCLUDED.amount,
          amount_type = EXCLUDED.amount_type,
          product_id = EXCLUDED.product_id,
          status = EXCLUDED.status,
          starts_at = EXCLUDED.starts_at,
          ends_at = EXCLUDED.ends_at,
          limited_time_only = EXCLUDED.limited_time_only,
          updated_at = now()`
      },
      client
    }
  );

  return next();
};
