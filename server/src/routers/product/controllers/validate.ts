import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { database } from '../../../middlewares';
import {
  CategoriesInterface,
  ProductBrandsInterface,
  ProductDiscountsInterface,
  ProductsInterface,
  UsersInterface
} from '../../../../../_shared/types';
import dayjs from 'dayjs';

export const validateCreateProduct = async (req: Request, resp: Response, next: NextFunction) => {
  const window = new JSDOM('').window;
  const purify = DOMPurify(window);
  const { product, brand }: { product: ProductsInterface; brand: ProductBrandsInterface } = req.body;
  const { client } = resp.locals;

  if (!product) {
    return next(new HttpException(400, `Product required`));
  }

  if (product.parentId) {
    const retrievedProduct = await database.retrieve<ProductsInterface[]>(`SELECT * FROM products`, {
      where: 'id = $1',
      params: [product.parentId],
      client
    });

    product.categoryId = retrievedProduct[0].categoryId;
    product.brandId = retrievedProduct[0].brandId;
  }

  if (brand) {
    const { name, owner, url, logoUrl } = brand;

    if (!name || validations.blankCheck.test(name)) {
      return next(new HttpException(400, `Brand name required`));
    } else if (typeof name !== 'string') {
      return next(new HttpException(400, `Invalid brand name`));
    } else if (url && typeof url !== 'string') {
      return next(new HttpException(400, `Invalid URLs`));
    } else if (logoUrl && typeof logoUrl !== 'string') {
      return next(new HttpException(400, `Invalid brand logo`));
    } else if (owner) {
      const user = await database.retrieve<UsersInterface[]>(`SELECT email FROM users`, {
        where: 'id = $1',
        params: [owner],
        client
      });

      if (user.length === 0) {
        return next(new HttpException(400, `The brand owner does not exist`));
      }
    }

    const exists = await database.retrieve<ProductBrandsInterface[]>('SELECT * FROM product_brands', {
      where: 'name = $1 AND owner = $2',
      params: [name, owner],
      client
    });

    if (exists.length) {
      return next(new HttpException(400, `A same brand and owner already exists`));
    }
  }

  if (product.about) {
    product.about = purify.sanitize(product.about);
  }

  if (product.details) {
    product.details = purify.sanitize(product.details);
  }

  const { name, excerpt, categoryId, brandId, description, about, details, urls } = product;

  if (!name || validations.blankCheck.test(name)) {
    return next(new HttpException(400, `Name required`));
  } else if (typeof name !== 'string') {
    return next(new HttpException(400, `Invalid name`));
  } else if (excerpt && typeof excerpt !== 'string') {
    return next(new HttpException(400, `Invalid excerpt`));
  } else if (description && typeof description !== 'string') {
    return next(new HttpException(400, `Invalid description`));
  } else if (brandId) {
    const brand = await database.retrieve<ProductBrandsInterface[]>('SELECT * FROM product_brands', {
      where: 'id = $1',
      params: [brandId],
      client
    });

    if (!brand.length) {
      return next(new HttpException(400, `The brand does not exist`));
    }
  } else if (about && typeof about !== 'string') {
    return next(new HttpException(400, `Invalid about`));
  } else if (details && typeof details !== 'string') {
    return next(new HttpException(400, `Invalid details`));
  }

  if (urls) {
    for (const url of urls) {
      if (url.url && !validations.urlCheck.test(url.url)) {
        return next(new HttpException(400, `Invalid URL`));
      } else if (!url.country || validations.blankCheck.test(url.country)) {
        return next(new HttpException(400, `Country required`));
      } else if (!validations.countryShortCodeCheck.test(url.country)) {
        return next(new HttpException(400, `Invalid country`));
      } else if (url.price && isNaN(url.price)) {
        return next(new HttpException(400, `Invalid price`));
      } else if (url.currency && !validations.currencyCheck.test(url.currency)) {
        return next(new HttpException(400, `Invalid currency`));
      } else if (!url.type || validations.blankCheck.test(url.type)) {
        return next(new HttpException(400, `Type required`));
      } else if (!['affiliate', 'dropship', 'direct'].includes(url.type)) {
        return next(new HttpException(400, `Invalidate type`));
      }

      if (url.discounts) {
        const discounts = url.discounts.filter((discount) => discount.status !== 'deleted');

        for (const discount of discounts) {
          if (
            !discount.amount ||
            (typeof discount.amount !== 'number' && validations.blankCheck.test(discount.amount))
          ) {
            return next(new HttpException(400, `Amount is required`));
          } else if (typeof discount.amount !== 'number' && isNaN(parseFloat(discount.amount))) {
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
            const params = [discount.id, discount.productUrlId];
            const where = [`id != $1`, `product_url_id = $2`];

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

            const exists = await database.retrieve<ProductDiscountsInterface[]>(
              `SELECT * FROM product_discounts`,
              {
                where: where.join(' AND '),
                params,
                client
              }
            );

            if (exists.length) {
              return next(new HttpException(400, `Two discounts cannot be active at the same time`));
            }
          }
        }
      }
    }
  }

  const category = await database.retrieve<CategoriesInterface[]>('SELECT * FROM categories', {
    where: 'id = $1',
    params: [categoryId],
    client
  });

  if (!category.length) {
    return next(new HttpException(400, `The category does not exist`));
  }

  return next();
};

export const validateSearchProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { value, category } = req.query;

  if (!value || validations.blankCheck.test(value.toString())) {
    return next(new HttpException(400, `Value required`));
  } else if (value && typeof value !== 'string') {
    return next(new HttpException(400, `Invalid value`));
  } else if (category && isNaN(parseInt(category.toString()))) {
    return next(new HttpException(400, `Invalid category`));
  }

  return next();
};

export const validateSortProducts = async (req: Request, resp: Response, next: NextFunction) => {
  const { products } = req.body;

  if (!products) {
    return next(new HttpException(400, `Products required`));
  } else if (!Array.isArray(products)) {
    return next(new HttpException(400, `Invalid products`));
  }

  return next();
};
