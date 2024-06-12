import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';

export const retrieveOptions = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { productId } = req.query;

  const options = await database.retrieve(
    `SELECT
      po.*,
      COALESCE(os.selections, '[]'::JSONB) AS selections
    FROM product_options AS po
    LEFT JOIN LATERAL (
      SELECT JSONB_AGG(os.*) AS selections
      FROM option_selections AS os
      WHERE os.option_id = po.id
    ) AS os ON true`,
    {
      where: 'po.product_id = $1',
      params: [productId],
      client
    }
  );

  resp.locals.response = { data: { options } };

  return next();
};
