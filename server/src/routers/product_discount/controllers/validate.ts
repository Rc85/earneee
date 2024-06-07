import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import dayjs from 'dayjs';

export const validateCreateProductDiscount = async (req: Request, resp: Response, next: NextFunction) => {
  const { discount } = req.body;

  if (!discount.amount || validations.blankCheck.test(discount.amount)) {
    return next(new HttpException(400, `Amount is required`));
  } else if (isNaN(parseFloat(discount.amount))) {
    return next(new HttpException(400, `Invalid amount`));
  } else if (!['fixed', 'percentage'].includes(discount.amountType)) {
    return next(new HttpException(400, `Invalid amount type`));
  } else if (discount.startsAt && !dayjs(discount.startsAt).isValid()) {
    return next(new HttpException(400, `Invalid start date`));
  } else if (discount.endsAt && !dayjs(discount.endsAt).isValid()) {
    return next(new HttpException(400, `Invalid end date`));
  } else if (discount.endsAt && dayjs().isAfter(dayjs(discount.endsAt))) {
    return next(new HttpException(400, `End date cannot be in the past`));
  } else if (!['active', 'inactive'].includes(discount.status)) {
    return next(new HttpException(400, `Invalid status`));
  }

  return next();
};
