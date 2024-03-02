import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/v1/auth/admin/product/variant',
  dbConnect,
  middleware(controllers.validateCreateVariant),
  middleware(controllers.createVariant),
  response
);

router.get('/v1/product/variant', dbConnect, middleware(controllers.retrieveVariant), response);

router.put(
  '/v1/auth/admin/product/variant',
  dbConnect,
  middleware(controllers.validateSortVariants),
  middleware(controllers.sortVariants),
  response
);

router.delete('/v1/auth/admin/product/variant', dbConnect, middleware(controllers.deleteVariant), response);

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

router.get(
  '/v1/marketplace/product/specification',
  dbConnect,
  middleware(controllers.retrieveMarketplaceProductSpecifications),
  response
);

router.get(
  '/v1/auth/marketplace/variants',
  dbConnect,
  middleware(controllers.retrieveMarketplaceVariants),
  response
);

export default router;
