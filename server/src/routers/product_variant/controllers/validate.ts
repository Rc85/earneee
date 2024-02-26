import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export const validateCreateVariant = async (req: Request, resp: Response, next: NextFunction) => {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);

  req.body.about = purify.sanitize(req.body.about);
  req.body.details = purify.sanitize(req.body.details);

  const { name, description, price, featured, status, urls, about, details } = req.body;

  if (!name || validations.blankCheck.test(name)) {
    return next(new HttpException(400, `Name required`));
  } else if (typeof name !== 'string') {
    return next(new HttpException(400, `Invalid name`));
  } else if (description && typeof description !== 'string') {
    return next(new HttpException(400, `Invalid description`));
  } else if (about && typeof about !== 'string') {
    return next(new HttpException(400, `Invalid value for about`));
  } else if (details && typeof details !== 'string') {
    return next(new HttpException(400, `Invalid value for details`));
  } else if (price && isNaN(price)) {
    return next(new HttpException(400, `Invalid price`));
  } else if (typeof featured !== 'boolean') {
    return next(new HttpException(400, `Featured must be true or false`));
  } else if (!['available', 'unavailable'].includes(status)) {
    return next(new HttpException(400, `Invalid status`));
  } else if (!validations.currencyCheck.test(req.body.currency)) {
    return next(new HttpException(400, `Invalid currency`));
  }

  if (urls) {
    for (const url of urls) {
      if (!validations.urlCheck.test(url.url)) {
        return next(new HttpException(400, `Invalid URL`));
      } else if (!url.url || validations.blankCheck.test(url.url)) {
        return next(new HttpException(400, `URL required`));
      } else if (!url.country || validations.blankCheck.test(url.country)) {
        return next(new HttpException(400, `Country required`));
      } else if (!validations.countryShortCodeCheck.test(url.country)) {
        return next(new HttpException(400, `Invalid country`));
      }
    }
  }

  return next();
};

export const validateSortVariants = async (req: Request, resp: Response, next: NextFunction) => {
  const { variants } = req.body;

  if (!variants || !(variants instanceof Array) || !variants.length) {
    return next(new HttpException(400, `Variants required`));
  }

  return next();
};
