import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';

export const validateAddProductMedia = async (req: Request, _: Response, next: NextFunction) => {
  const { url, height, width, type, status } = req.body;

  if (!url || validations.blankCheck.test(url)) {
    return next(new HttpException(400, `URL required`));
  } else if (typeof url !== 'string' || !validations.urlCheck.test(url)) {
    return next(new HttpException(400, `Invalid URL`));
  } else if (height == null || isNaN(height)) {
    return next(new HttpException(400, `Invalid height`));
  } else if (width == null || isNaN(width)) {
    return next(new HttpException(400, `Invalid width`));
  } else if (!['image', 'video', 'youtube'].includes(type)) {
    return next(new HttpException(400, `Invalid media type`));
  } else if (!['enabled', 'disabled'].includes(status)) {
    return next(new HttpException(400, `Invalid status`));
  }

  return next();
};

export const validateSortProductMedia = async (req: Request, resp: Response, next: NextFunction) => {
  const { media } = req.body;

  if (!media || !(media instanceof Array) || !media.length) {
    return next(new HttpException(400, `There is nothing to sort`));
  }

  return next();
};

export const validateUpdateProductMedia = async (req: Request, resp: Response, next: NextFunction) => {
  const { status } = req.body;

  if (!['enabled', 'disabled'].includes(status)) {
    return next(new HttpException(400, `Invalid status`));
  }

  return next();
};
