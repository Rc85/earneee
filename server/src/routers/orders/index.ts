import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.get('/v1/auth/user/cart', dbConnect, middleware(controllers.retrieveCart), response);

router.post(
  '/v1/auth/user/cart/item',
  dbConnect,
  middleware(controllers.validateAddProduct),
  middleware(controllers.addProduct),
  response
);

router.delete(
  '/v1/auth/user/cart/item',
  dbConnect,
  middleware(controllers.validateRemoveProduct),
  middleware(controllers.removeProduct),
  response
);

router.post(
  '/v1/auth/user/cart/checkout',
  dbConnect,
  middleware(controllers.validateCheckout),
  middleware(controllers.checkout),
  response
);

export default router;
