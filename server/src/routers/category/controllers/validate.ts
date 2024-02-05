import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';

export const validateCreateCategory = async (req: Request, resp: Response, next: NextFunction) => {
  const { name, type } = req.body;

  if (!name || validations.blankCheck.test(name)) {
    return next(new HttpException(400, `Name is required`));
  } else if (typeof name !== 'string') {
    return next(new HttpException(400, `Invalid name`));
  } else if (type && typeof type !== 'string') {
    return next(new HttpException(400, `Invalid type`));
  }

  return next();
};
