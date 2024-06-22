import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { generateKey } from '../../../../../_shared/utils';

export const createQuestion = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { question, answer, category, status } = req.body;
  const id = req.body.id || generateKey(1);

  const faq = await database.create(
    'faqs',
    ['id', 'question', 'answer', 'category', 'status'],
    [id, question, answer, category, status],
    {
      conflict: {
        columns: 'id',
        do: `UPDATE SET
          question = EXCLUDED.question,
          answer = EXCLUDED.answer,
          category = EXCLUDED.category,
          status = EXCLUDED.status,
          updated_at = now()`
      },
      client
    }
  );

  resp.locals.response = { data: { statusText: faq[0].updatedAt ? 'Question updated' : 'Question created' } };

  return next();
};
