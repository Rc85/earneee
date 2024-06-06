import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { database } from '../../../database';

export const validateCreateProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  const { product, brand } = req.body;
  const { client } = resp.locals;

  if (!product) {
    return next(new HttpException(400, `Product required`));
  }

  if (brand) {
    const { name, owner, urls, logoUrl, status } = brand;

    if (!name || validations.blankCheck.test(name)) {
      return next(new HttpException(400, `Brand name required`));
    } else if (typeof name !== 'string') {
      return next(new HttpException(400, `Invalid brand name`));
    } else if (!urls || !(urls instanceof Array) || urls.length === 0) {
      return next(new HttpException(400, `At least one brand link is required`));
    } else if (logoUrl && typeof logoUrl !== 'string') {
      return next(new HttpException(400, `Invalid brand logo`));
    } else if (owner) {
      const user = await database.retrieve('users', {
        columns: 'email',
        where: 'id = $1',
        params: [owner],
        client
      });

      if (user.length === 0) {
        return next(new HttpException(400, `The brand owner does not exist`));
      }
    }

    const exists = await database.retrieve('product_brands', {
      where: 'name = $1 AND owner = $2',
      params: [name, owner],
      client
    });

    if (exists.length) {
      return next(new HttpException(400, `A same brand and owner already exists`));
    }
  }

  product.about = purify.sanitize(product.about);
  product.details = purify.sanitize(product.details);

  const { name, excerpt, categoryId, brandId, description, about, details, type } = product;

  if (!name || validations.blankCheck.test(name)) {
    return next(new HttpException(400, `Name required`));
  } else if (!type || validations.blankCheck.test(type)) {
    return next(new HttpException(400, `Type required`));
  } else if (!['affiliate', 'dropship', 'direct'].includes(type)) {
    return next(new HttpException(400, `Invalidate type`));
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
  }

  const category = await database.retrieve('categories', { where: 'id = $1', params: [categoryId], client });

  if (!category.length) {
    return next(new HttpException(400, `The category does not exist`));
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
