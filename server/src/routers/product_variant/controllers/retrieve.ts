import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const retrieveVariant = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const where = [];
  const params = [];
  const { categoryId, subcategoryId, groupId, type, variantId, featured } = req.query;

  if (variantId) {
    params.push(variantId);

    where.push(`pv.id = $${params.length}`);
  }

  if (featured) {
    where.push(`pv.featured IS TRUE`);
  }

  const id = categoryId || subcategoryId || groupId || undefined;

  if (id) {
    params.push(id);

    where.push(`p.product->>'category_id' = $${params.length}`);
  }

  const variants = await database.product.variant.retrieve({
    where: where.join(' AND '),
    params,
    orderBy: type === 'new' ? 'pv.created_at DESC' : 'pv.ordinance',
    client
  });

  resp.locals.response = { data: { variants } };

  return next();
};
