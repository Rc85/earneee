import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { FaqsInterface } from '../../../../../_shared/types';

export const retrieveFaqs = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { questionId } = req.query;
  const params = [];
  const where = [];

  if (questionId) {
    params.push(questionId);

    where.push(`q.id = $${params.length}`);
  }

  const questions = await database.retrieve<FaqsInterface[]>(`SELECT q.* FROM faqs AS q`, {
    where: where.join(' AND '),
    orderBy: 'q.created_at DESC',
    params,
    client
  });

  resp.locals.response = { data: { questions } };

  return next();
};
