import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { database } from '../../../database';

export const validateCreateProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);

  req.body.description = purify.sanitize(req.body.description);

  const { name, excerpt, categoryId, type, affiliateId, brandId, description } = req.body;
  const { client } = resp.locals;

  if (!name || validations.blankCheck.test(name)) {
    return next(new HttpException(400, `Name required`));
  } else if (typeof name !== 'string') {
    return next(new HttpException(400, `Invalid name`));
  } else if (excerpt && typeof excerpt !== 'string') {
    return next(new HttpException(400, `Invalid excerpt`));
  } else if (!['affiliate', 'dropship'].includes(type)) {
    return next(new HttpException(400, `Invalid type`));
  } else if (description && typeof description !== 'string') {
    return next(new HttpException(400, `Invalid description`));
  } else if (affiliateId) {
    const affiliate = await database.retrieve('affiliates', {
      where: 'id = $1',
      params: [affiliateId],
      client
    });

    if (!affiliate.length) {
      return next(new HttpException(400, `The affiliate does not exist`));
    }
  } else if (brandId) {
    const brand = await database.retrieve('product_brands', { where: 'id = $1', params: [brandId], client });

    if (!brand.length) {
      return next(new HttpException(400, `The brand does not exist`));
    }
  }

  const category = await database.retrieve('categories', { where: 'id = $1', params: [categoryId], client });

  if (!category.length) {
    return next(new HttpException(400, `The category does not exist`));
  }

  return next();
};
