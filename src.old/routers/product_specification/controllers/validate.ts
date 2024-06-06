import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';

export const validateCreateProductSpecification = async (req: Request, _: Response, next: NextFunction) => {
  const { specifications } = req.body;

  if (!specifications || !(specifications instanceof Array) || !specifications.length) {
    return next(new HttpException(400, `At least one specification is required`));
  }

  for (const specification of specifications) {
    if (!specification.name || validations.blankCheck.test(specification.name)) {
      return next(new HttpException(400, `Name required`));
    } else if (typeof specification.name !== 'string') {
      return next(new HttpException(400, `Invalid name`));
    } else if (!specification.value || validations.blankCheck.test(specification.value)) {
      return next(new HttpException(400, `Specification details required`));
    } else if (typeof specification.value !== 'string') {
      return next(new HttpException(400, `Invalid specification details`));
    }
  }

  return next();
};

export const validateSortProductSpecifications = async (req: Request, resp: Response, next: NextFunction) => {
  const { specifications } = req.body;

  if (!specifications || !(specifications instanceof Array) || !specifications.length) {
    return next(new HttpException(400, `Specifications required`));
  }

  return next();
};

export const validateUpdateProductSpecification = async (
  req: Request,
  resp: Response,
  next: NextFunction
) => {
  const { specification } = req.body;

  if (!specification.name || validations.blankCheck.test(specification.name)) {
    return next(new HttpException(400, `Name required`));
  } else if (typeof specification.name !== 'string') {
    return next(new HttpException(400, `Invalid name`));
  } else if (!specification.value || validations.blankCheck.test(specification.value)) {
    return next(new HttpException(400, `Specification details required`));
  } else if (typeof specification.value !== 'string') {
    return next(new HttpException(400, `Invalid specification details`));
  }

  return next();
};
