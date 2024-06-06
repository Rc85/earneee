import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';

export const sortProductMedia = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { media } = req.body;

  if (media) {
    for (const index in media) {
      const ordinance = parseInt(index) + 1;
      const m = media[index];

      await database.update('product_media', ['ordinance'], {
        where: 'id = $2',
        params: [ordinance, m.id],
        client
      });
    }
  }

  return next();
};
