import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import { database } from '../../../middlewares';
import { ProductsInterface } from '../../../../../_shared/types';

export const validateCreateOption = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { name, description, minimumSelections, maximumSelections, required, productId, status, selections } =
    req.body.option;

  if (!name || validations.blankCheck.test(name)) {
    return next(new HttpException(400, `Name is required`));
  } else if (description && typeof description !== 'string') {
    return next(new HttpException(400, `Invalid description`));
  } else if (description && description.length > 100) {
    return next(new HttpException(400, `Description is too long`));
  } else if (maximumSelections && typeof maximumSelections !== 'number') {
    return next(new HttpException(400, `Invalid maximum selections`));
  } else if (minimumSelections && typeof minimumSelections !== 'number') {
    return next(new HttpException(400, `Invalid minimum selections`));
  } else if (required && typeof required !== 'boolean') {
    return next(new HttpException(400, `Invalid required`));
  } else if (status && !['available', 'unavailable'].includes(status)) {
    return next(new HttpException(400, `Invalid status`));
  }

  const product = await database.retrieve<ProductsInterface[]>(`SELECT * FROM products`, {
    where: 'id = $1',
    params: [productId],
    client
  });

  if (!product.length) {
    return next(new HttpException(400, `Product does not exist`));
  } else if (!(selections instanceof Array)) {
    return next(new HttpException(400, `Invalid selections`));
  } else if (!selections.length) {
    return next(new HttpException(400, `At least 1 selection is required`));
  }

  for (const selection of selections) {
    const { name, description, status } = selection;

    if (typeof selection.price === 'string') {
      selection.price = parseFloat(selection.price);
    }

    if (!name || validations.blankCheck.test(name)) {
      return next(new HttpException(400, `Selection name is required`));
    } else if (description && typeof description !== 'string') {
      return next(new HttpException(400, `Invalid selection description`));
    } else if (selection.price && typeof selection.price !== 'number') {
      return next(new HttpException(400, `Invalid selection price`));
    } else if (status && !['available', 'unavailable'].includes(status)) {
      return next(new HttpException(400, `Invalid selection status`));
    }
  }

  return next();
};
