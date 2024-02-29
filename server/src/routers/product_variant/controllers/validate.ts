import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { database } from '../../../database';

export const validateCreateVariant = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);

  req.body.about = purify.sanitize(req.body.about);
  req.body.details = purify.sanitize(req.body.details);

  const { name, description, featured, status, urls, about, details, excerpt } = req.body;

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
  } else if (typeof featured !== 'boolean') {
    return next(new HttpException(400, `Featured must be true or false`));
  } else if (!['available', 'unavailable'].includes(status)) {
    return next(new HttpException(400, `Invalid status`));
  } else if (excerpt && typeof excerpt !== 'string') {
    return next(new HttpException(400, `Invalid excerpt`));
  }

  if (urls) {
    for (const url of urls) {
      const params = [url.productId, url.id];
      const where = [`product_id = $1`, `NOT id = $2`];

      if (url.variantId) {
        params.push(url.variantId);

        where.push(`variant_id = $3`);
      } else {
        where.push(`variant_id IS NULL`);
      }

      const exist = await database.retrieve('product_urls', { where: where.join(' AND '), params, client });

      if (exist.length) {
        return next(new HttpException(400, `URL already exists`));
      } else if (!validations.urlCheck.test(url.url)) {
        return next(new HttpException(400, `Invalid URL`));
      } else if (!url.url || validations.blankCheck.test(url.url)) {
        return next(new HttpException(400, `URL required`));
      } else if (!url.country || validations.blankCheck.test(url.country)) {
        return next(new HttpException(400, `Country required`));
      } else if (!validations.countryShortCodeCheck.test(url.country)) {
        return next(new HttpException(400, `Invalid country`));
      } else if (url.price && isNaN(url.price)) {
        return next(new HttpException(400, `Invalid price`));
      } else if (url.currency && !validations.currencyCheck.test(url.currency)) {
        return next(new HttpException(400, `Invalid currency`));
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
