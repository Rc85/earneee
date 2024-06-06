import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { AffiliatesInterface } from '../../../../../_shared/types';

export const retrieveAffiliates = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;

  const offset = req.query.offset?.toString() || '0';
  const where = [];
  const params = [];

  if (req.query.affiliateId) {
    where.push(`id = $1`);
    params.push(req.query.affiliateId);
  }

  const affiliates = await database.retrieve<AffiliatesInterface[]>(
    `SELECT
      id,
      name,
      url,
      description,
      manager_url,
      logo_url,
      status
    FROM affiliates AS a`,
    {
      where: where.join(' AND '),
      params,
      offset,
      limit: '20',
      client
    }
  );

  const count = await database.retrieve<{ count: number }[]>(`SELECT COUNT(*)::INT FROM affiliates`, {
    where: where.join(' AND '),
    params,
    client
  });

  resp.locals.response = { status: 200, data: { affiliates, count: count[0].count } };

  return next();
};
