import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.get('/v1/product', dbConnect, middleware(controllers.retrieveProducts), response);

router.post(
  '/v1/auth/admin/product',
  dbConnect,
  middleware(controllers.validateCreateProduct),
  middleware(controllers.createProduct),
  response
);

router.delete('/v1/auth/admin/product', dbConnect, middleware(controllers.deleteProduct), response);

router.get(
  '/v1/product/search',
  dbConnect,
  middleware(controllers.validateSearchProducts),
  middleware(controllers.searchProducts),
  response
);

router.get('/v1/product/showcase', dbConnect, middleware(controllers.retrieveProductShowcase), response);

export default router;
