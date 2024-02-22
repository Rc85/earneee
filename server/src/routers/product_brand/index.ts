import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.get('/api/v1/product/brand', dbConnect, middleware(controllers.retrieveProductBrands), response);

router.post(
  '/api/v1/auth/admin/brand',
  dbConnect,
  middleware(controllers.validateCreateBrand),
  middleware(controllers.createBrand),
  response
);

router.delete('/api/v1/auth/admin/product/brand', dbConnect, middleware(controllers.deleteBrand), response);

export default router;
