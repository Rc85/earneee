import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/v1/auth/admin/product/specification',
  dbConnect,
  middleware(controllers.validateCreateProductSpecification),
  middleware(controllers.createProductSpecification),
  response
);

router.get(
  '/v1/product/specification',
  dbConnect,
  middleware(controllers.retrieveProductSpecification),
  response
);

router.delete(
  '/v1/auth/admin/product/specification',
  dbConnect,
  middleware(controllers.deleteProductSpecification),
  response
);

router.put(
  '/v1/auth/admin/product/specification',
  dbConnect,
  middleware(controllers.validateSortProductSpecifications),
  middleware(controllers.sortProductSpecifications),
  response
);

router.patch(
  '/v1/auth/admin/product/specification',
  dbConnect,
  middleware(controllers.validateUpdateProductSpecification),
  middleware(controllers.updateProductSpecification),
  response
);

export default router;
