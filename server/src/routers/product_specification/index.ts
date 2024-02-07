import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/api/v1/auth/admin/product/specification/create',
  dbConnect,
  middleware(controllers.validateCreateProductSpecification),
  middleware(controllers.createProductSpecification),
  response
);

router.get(
  '/api/v1/product/specification/retrieve',
  dbConnect,
  middleware(controllers.retrieveProductSpecification),
  response
);

router.delete(
  '/api/v1/auth/admin/product/specification/delete',
  dbConnect,
  middleware(controllers.deleteProductSpecification),
  response
);

router.put(
  '/api/v1/auth/admin/product/specification/sort',
  dbConnect,
  middleware(controllers.validateSortProductSpecifications),
  middleware(controllers.sortProductSpecifications),
  response
);

export default router;
