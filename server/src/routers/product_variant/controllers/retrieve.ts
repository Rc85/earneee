import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveVariant = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const where = [];
  const params = [];
  const { variantId } = req.query;

  if (variantId) {
    params.push(variantId);

    where.push(`pv.id = $1`);
  }

  const variants = await database.product.variant.retrieve({
    where: where.join(' AND '),
    params,
    orderBy: 'pv.ordinance',
    client
  });

  resp.locals.response = { data: { variants } };

  return next();
};
