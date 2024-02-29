import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { database } from '../../../database';

export const validateCreateProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);

  req.body.about = purify.sanitize(req.body.about);
  req.body.details = purify.sanitize(req.body.details);

  const { name, excerpt, categoryId, brandId, description, about, details, price, currency, urls } = req.body;
  const { client } = resp.locals;

  if (!name || validations.blankCheck.test(name)) {
    return next(new HttpException(400, `Name required`));
  } else if (typeof name !== 'string') {
    return next(new HttpException(400, `Invalid name`));
  } else if (excerpt && typeof excerpt !== 'string') {
    return next(new HttpException(400, `Invalid excerpt`));
  } else if (description && typeof description !== 'string') {
    return next(new HttpException(400, `Invalid description`));
  } else if (brandId) {
    const brand = await database.retrieve('product_brands', { where: 'id = $1', params: [brandId], client });

    if (!brand.length) {
      return next(new HttpException(400, `The brand does not exist`));
    }
  } else if (about && typeof about !== 'string') {
    return next(new HttpException(400, `Invalid about`));
  } else if (details && typeof details !== 'string') {
    return next(new HttpException(400, `Invalid details`));
  } else if (price && isNaN(parseFloat(price.toString()))) {
    return next(new HttpException(400, `Invalid price`));
  } else if (currency && !validations.currencyCheck.test(currency.toString())) {
    return next(new HttpException(400, `Invalid currency`));
  }

  const category = await database.retrieve('categories', { where: 'id = $1', params: [categoryId], client });

  if (!category.length) {
    return next(new HttpException(400, `The category does not exist`));
  }

  if (urls) {
    if (!(urls instanceof Array)) {
      return next(new HttpException(400, `Invalid urls`));
    }

    for (const url of urls) {
      if (!validations.urlCheck.test(url.url)) {
        return next(new HttpException(400, `Invalid url`));
      }
    }
  }

  return next();
};

export const validateSearchProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { value, category } = req.query;

  if (!value || validations.blankCheck.test(value.toString())) {
    return next(new HttpException(400, `Value required`));
  } else if (value && typeof value !== 'string') {
    return next(new HttpException(400, `Invalid value`));
  } else if (category && isNaN(parseInt(category.toString()))) {
    return next(new HttpException(400, `Invalid category`));
  }

  return next();
};
