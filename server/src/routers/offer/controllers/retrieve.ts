import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { OffersInterface } from '../../../../../_shared/types';

export const retrieveOffers = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { offerId } = req.query;

  const params = [];
  const where = [];

  if (offerId) {
    params.push(offerId);

    where.push(`o.id = $1`);
  }

  const offers = await database.retrieve<OffersInterface[]>(
    `SELECT
      id,
      name,
      url,
      logo_url,
      logo_path,
      logo_width,
      logo_height,
      status,
      start_date,
      end_date,
      details
    FROM offers AS o`,
    {
      where: where.join(' AND '),
      params,
      orderBy: 'o.ordinance',
      client
    }
  );

  resp.locals.response = { data: { offers } };

  return next();
};
