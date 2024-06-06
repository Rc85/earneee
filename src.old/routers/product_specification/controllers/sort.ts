import { NextFunction, Request, Response } from 'express';
import { database } from '../../../../src/middlewares/database';

export const sortProductSpecifications = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { specifications } = req.body;

  if (specifications) {
    for (const index in specifications) {
      const ordinance = parseInt(index) + 1;
      const specification = specifications[index];

      await database.update('specifications', ['ordinance'], {
        where: 'id = $2',
        params: [ordinance, specification.id],
        client
      });
    }
  }

  return next();
};
