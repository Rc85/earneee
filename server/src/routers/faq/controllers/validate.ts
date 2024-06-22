import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';

export const validateCreateQuestion = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.body.answer === '<p></p>') {
    req.body.answer = '';
  }

  const { question, answer, status } = req.body;

  if (!question || validations.blankCheck.test(question)) {
    return next(new HttpException(400, `Question required`));
  } else if (!answer || validations.blankCheck.test(answer)) {
    return next(new HttpException(400, `Answer required`));
  } else if (!['show', 'hide'].includes(status)) {
    return next(new HttpException(400, `Invalid status`));
  }

  return next();
};
