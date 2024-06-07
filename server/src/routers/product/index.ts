import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.get('/v1/auth/admin/product', dbConnect, middleware(controllers.retrieveProducts), response);

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

router.put(
  '/v1/auth/admin/product',
  dbConnect,
  middleware(controllers.validateSortProducts),
  middleware(controllers.sortProducts),
  response
);

router.get(
  '/v1/auth/marketplace/products',
  dbConnect,
  middleware(controllers.retrieveMarketplaceProducts),
  response
);

router.get(
  '/v1/auth/marketplace/product',
  dbConnect,
  middleware(controllers.retrieveMarketplaceProduct),
  response
);

router.get('/v1/product/showcase', dbConnect, middleware(controllers.retrieveProductShowcase), response);

export default router;
