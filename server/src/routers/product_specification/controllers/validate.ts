import { NextFunction, Request, Response } from 'express';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { HttpException, validations } from '../../../utils';

export const validateCreateProductSpecification = async (req: Request, _: Response, next: NextFunction) => {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);

  req.body.value = purify.sanitize(req.body.value);

  const { name, value } = req.body;

  if (!name || validations.blankCheck.test(name)) {
    return next(new HttpException(400, `Name required`));
  } else if (typeof name !== 'string') {
    return next(new HttpException(400, `Invalid name`));
  } else if (!value || validations.blankCheck.test(value)) {
    return next(new HttpException(400, `Specification details required`));
  } else if (typeof value !== 'string') {
    return next(new HttpException(400, `Invalid specification details`));
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
