import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import { database } from '../../../database';

export const validateCreateProductUrl = async (req: Request, resp: Response, next: NextFunction) => {
  const { url, country, variantId } = req.body;
  const { client } = resp.locals;

  if (!validations.urlCheck.test(url)) {
    return next(new HttpException(400, `Invalid URL`));
  } else if (!url || validations.blankCheck.test(url)) {
    return next(new HttpException(400, `URL required`));
  } else if (!country || validations.blankCheck.test(country)) {
    return next(new HttpException(400, `Country required`));
  } else if (!validations.countryShortCodeCheck.test(country)) {
    return next(new HttpException(400, `Invalid country`));
  }

  const variant = await database.retrieve('product_variants', {
    where: 'id = $1',
    params: [variantId],
    client
  });

  if (!variant.length) {
    return next(new HttpException(400, `The variant does not exist`));
  }

  return next();
};
