import { NextFunction, Request, Response } from 'express';
import { database } from '../../../../src/middlewares/database';

export const retrieveOffers = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { offerId } = req.query;

  const params = [];
  const where = [];

  if (offerId) {
    params.push(offerId);

    where.push(`o.id = $1`);
  }

  const offers = await database.offer.retrieve({
    where: where.join(' AND '),
    params,
    orderBy: 'o.ordinance',
    client
  });

  resp.locals.response = { data: { offers } };

  return next();
};
