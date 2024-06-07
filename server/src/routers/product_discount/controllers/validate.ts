import e, { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import dayjs from 'dayjs';
import { database } from '../../../middlewares';
import { ProductDiscountsInterface } from '../../../../../_shared/types';

export const validateCreateProductDiscount = async (req: Request, resp: Response, next: NextFunction) => {
  const { discount } = req.body;
  const { client } = resp.locals;

  if (!discount.amount || validations.blankCheck.test(discount.amount)) {
    return next(new HttpException(400, `Amount is required`));
  } else if (isNaN(parseFloat(discount.amount))) {
    return next(new HttpException(400, `Invalid amount`));
  } else if (!['fixed', 'percentage'].includes(discount.amountType)) {
    return next(new HttpException(400, `Invalid amount type`));
  } else if (!discount.startsAt || validations.blankCheck.test(discount.startsAt)) {
    return next(new HttpException(400, `Start date is required`));
  } else if (!dayjs(discount.startsAt).isValid()) {
    return next(new HttpException(400, `Invalid start date`));
  } else if (discount.endsAt && !dayjs(discount.endsAt).isValid()) {
    return next(new HttpException(400, `Invalid end date`));
  } else if (discount.endsAt && dayjs().isAfter(dayjs(discount.endsAt))) {
    return next(new HttpException(400, `End date cannot be in the past`));
  } else if (!['active', 'inactive'].includes(discount.status)) {
    return next(new HttpException(400, `Invalid status`));
  } else if (typeof discount.limitedTimeOnly !== 'boolean') {
    return next(new HttpException(400, `Limited time only must be true or false`));
  }

  if (discount.startsAt || discount.endsAt) {
    const params = [discount.id, discount.productId];
    const where = [`id != $1`, `product_id = $2`];

    if (!discount.endsAt) {
      params.push(discount.startsAt);

      where.push(`(ends_at IS NULL OR (ends_at >= $${params.length}))`);
    } else {
      params.push(discount.startsAt, discount.endsAt);

      where.push(
        `(ends_at IS NULL OR $${params.length - 1}::TIMESTAMPTZ BETWEEN starts_at AND ends_at OR $${
          params.length
        }::TIMESTAMPTZ BETWEEN starts_at AND ends_at)`
      );
    }

    const exists = await database.retrieve<ProductDiscountsInterface[]>(`SELECT * FROM product_discounts`, {
      where: where.join(' AND '),
      params,
      client
    });

    if (exists.length) {
      return next(new HttpException(400, `Two discounts cannot be active at the same time`));
    }
  }

  return next();
};
