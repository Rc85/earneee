import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import { database } from '../../../database';

export const validateCreateProductOption = async (req: Request, resp: Response, next: NextFunction) => {
  const { name, required, selections, status, productId, variantId } = req.body;
  const { client } = resp.locals;

  if (!name || validations.blankCheck.test(name)) {
    return next(new HttpException(400, `Name required`));
  } else if (typeof name !== 'string') {
    return next(new HttpException(400, `Invalid name`));
  } else if (typeof required !== 'boolean') {
    return next(new HttpException(400, `Required must be true or false`));
  } else if (!['available', 'unavailable'].includes(status)) {
    return next(new HttpException(400, `Invalid status`));
  }

  const params = [name, productId];
  const where = [`name = $1`, `product_id = $2`];

  if (variantId) {
    params.push(variantId);

    where.push(`variant_id = $${params.length}`);
  } else {
    where.push(`variant_id IS NULL`);
  }

  const option = await database.retrieve('product_options', {
    where: where.join(' AND '),
    params,
    client
  });

  if (option.length) {
    return next(new HttpException(400, `Option already exists`));
  }

  if (selections) {
    for (const selection of selections) {
      if (!selection.name || validations.blankCheck.test(selection.name)) {
        return next(new HttpException(400, `Selection name required`));
      } else if (typeof selection.name !== 'string') {
        return next(new HttpException(400, `Invalid selection name`));
      } else if (selection.price && isNaN(selection.price)) {
        return next(new HttpException(400, `Invalid selection price`));
      } else if (!['available', 'unavailable'].includes(selection.status)) {
        return next(new HttpException(400, `Invalid selection status`));
      }
    }
  }

  return next();
};
