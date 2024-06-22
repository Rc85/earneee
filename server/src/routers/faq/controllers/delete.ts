import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';

export const deleteQuestion = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { questionId } = req.query;

  await database.delete('faqs', { where: 'id = $1', params: [questionId], client });

  return next();
};
