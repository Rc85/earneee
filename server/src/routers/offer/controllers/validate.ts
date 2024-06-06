import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import dayjs from 'dayjs';

export const validateCreateOffer = async (req: Request, _: Response, next: NextFunction) => {
  const { name, url, logoUrl, startDate, endDate, details, status } = req.body;

  if (name && typeof name !== 'string') {
    return next(new HttpException(400, `Invalid name`));
  } else if (!url || validations.blankCheck.test(url)) {
    return next(new HttpException(400, `URL is required`));
  } else if (details && typeof details !== 'string') {
    return next(new HttpException(400, `Invalid details`));
  } else if (!/^https:\/\//.test(url) || typeof url !== 'string') {
    return next(new HttpException(400, `Invalid URL`));
  } else if (typeof name !== 'string') {
    return next(new HttpException(400, `Invalid name`));
  } else if (startDate && isNaN(new Date(startDate).getTime())) {
    return next(new HttpException(400, `Invalid start date`));
  } else if (endDate && isNaN(new Date(endDate).getTime())) {
    return next(new HttpException(400, `Invalid start date`));
  } else if (startDate && endDate && dayjs(startDate).isAfter(dayjs(endDate))) {
    return next(new HttpException(400, `Start date cannot be after end date`));
  } else if (status && !['active', 'inactive'].includes(status)) {
    return next(new HttpException(400, `Invalid status`));
  } else if (!logoUrl || validations.blankCheck.test(logoUrl)) {
    return next(new HttpException(400, `Logo required`));
  } else if (typeof logoUrl !== 'string') {
    return next(new HttpException(400, `Invalid logo`));
  }

  return next();
};

export const validateSortOffers = async (req: Request, resp: Response, next: NextFunction) => {
  const { offers } = req.body;

  if (!(offers instanceof Array)) {
    return next(new HttpException(400, `Invalid offers`));
  }

  return next();
};
