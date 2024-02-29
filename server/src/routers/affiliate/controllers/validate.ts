import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';

export const validateAddAffiliate = async (req: Request, _: Response, next: NextFunction) => {
  const { name, managerUrl, status, url } = req.body;

  if (!name || validations.blankCheck.test(name)) {
    return next(new HttpException(400, `Name required`));
  } else if (status && !['active', 'inactive'].includes(status)) {
    return next(new HttpException(400, `Status must be active or inactive`));
  } else if (managerUrl && !/^https/.test(managerUrl)) {
    return next(new HttpException(400, `Invalid manager URL`));
  } else if (url && !validations.urlCheck.test(url)) {
    return next(new HttpException(400, `Invalid website URL`));
  }

  return next();
};
