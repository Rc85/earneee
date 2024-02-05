import { NextFunction, Request, Response } from 'express';
import { database } from '../../../database';

export const sortOffers = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { offers } = req.body;

  if (offers) {
    for (const index in offers) {
      const ordinance = parseInt(index) + 1;
      const offer = offers[index];

      await database.update('offers', ['ordinance'], {
        where: 'id = $2',
        params: [ordinance, offer.id],
        client
      });
    }
  }

  return next();
};
