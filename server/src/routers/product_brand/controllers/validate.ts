import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import { database } from '../../../middlewares';
import { ProductBrandsInterface, UsersInterface } from '../../../../../_shared/types';

export const validateCreateBrand = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { name, owner, urls, logoUrl, status } = req.body;

  if (!name || validations.blankCheck.test(name)) {
    return next(new HttpException(400, `Name required`));
  } else if (typeof name !== 'string') {
    return next(new HttpException(400, `Invalid name`));
  } else if (urls && !(urls instanceof Array)) {
    return next(new HttpException(400, `Invalid URLs`));
  } else if (logoUrl && typeof logoUrl !== 'string') {
    return next(new HttpException(400, `Invalid logo`));
  } else if (owner) {
    const user = await database.retrieve<UsersInterface[]>(`SELECT email FROM users`, {
      where: 'id = $1',
      params: [owner],
      client
    });

    if (user.length === 0) {
      return next(new HttpException(400, `The owner does not exist`));
    }
  } else if (status && !['active', 'inactive'].includes(status)) {
    return next(new HttpException(400, `Invalid status`));
  }

  const brand = await database.retrieve<ProductBrandsInterface[]>(`SELECT * FROM product_brands`, {
    where: 'name = $1 AND owner = $2',
    params: [name, owner],
    client
  });

  if (brand.length) {
    return next(new HttpException(400, `A same brand and owner already exists`));
  }

  return next();
};
