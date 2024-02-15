import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/api/v1/auth/admin/product/variant/create',
  dbConnect,
  middleware(controllers.validateCreateVariant),
  middleware(controllers.createVariant),
  response
);

router.get('/api/v1/product/variant/retrieve', dbConnect, middleware(controllers.retrieveVariant), response);

router.put(
  '/api/v1/auth/admin/product/variant/sort',
  dbConnect,
  middleware(controllers.validateSortVariants),
  middleware(controllers.sortVariants),
  response
);

router.delete(
  '/api/v1/auth/admin/product/variant/delete',
  dbConnect,
  middleware(controllers.deleteVariant),
  response
);

router.get(
  '/api/v1/auth/marketplace/product/retrieve',
  dbConnect,
  middleware(controllers.retrieveMarketplaceProducts),
  response
);

router.get(
  '/api/v1/auth/marketplace/product/:id',
  dbConnect,
  middleware(controllers.retrieveMarketplaceProduct),
  response
);

export default router;
