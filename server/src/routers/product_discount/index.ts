import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/v1/auth/admin/product/discount',
  dbConnect,
  middleware(controllers.validateCreateProductDiscount),
  middleware(controllers.createProductDiscount),
  response
);

router.get(
  '/v1/auth/admin/product/discount',
  dbConnect,
  middleware(controllers.retrieveProductDiscounts),
  response
);

router.delete(
  '/v1/auth/admin/product/discount',
  dbConnect,
  middleware(controllers.deleteProductDiscount),
  response
);

export default router;
