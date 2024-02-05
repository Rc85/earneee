import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';

export const validateAddAffiliate = async (req: Request, resp: Response, next: NextFunction) => {
  const { name, managerUrl, commissionRate, rateType, status, urls } = req.body;

  if (!name || validations.blankCheck.test(name)) {
    return next(new HttpException(400, `Name required`));
  } else if (commissionRate && isNaN(parseFloat(commissionRate))) {
    return next(new HttpException(400, `Invalid commission rate`));
  } else if (rateType && !['fixed', 'percentage'].includes(rateType)) {
    return next(new HttpException(400, `Rate type must be fixed or percentage`));
  } else if (status && !['active', 'inactive'].includes(status)) {
    return next(new HttpException(400, `Status must be active or inactive`));
  } else if (managerUrl && !/^https/.test(managerUrl)) {
    return next(new HttpException(400, `Invalid manager URL`));
  } else if (!urls || !(urls instanceof Array) || urls.length === 0) {
    return next(new HttpException(400, `At least 1 website link is required`));
  }

  if (urls) {
    for (const url of urls) {
      if (url.url && !/^https/.test(url.url)) {
        return next(new HttpException(400, `Invalid website link`));
      } else if (url.country && !validations.countryShortCodeCheck.test(url.country)) {
        return next(new HttpException(400, `Invalid website link country`));
      }
    }
  }

  return next();
};
