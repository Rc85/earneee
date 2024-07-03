import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.get('/v1/product/brand', dbConnect, middleware(controllers.retrieveProductBrands), response);

router.post(
  '/v1/auth/admin/brand',
  dbConnect,
  middleware(controllers.validateCreateBrand),
  middleware(controllers.createBrand),
  response
);

router.delete('/v1/auth/admin/brand', dbConnect, middleware(controllers.deleteBrand), response);

router.get('/v1/auth/admin/brand/owners', dbConnect, middleware(controllers.retrieveBrandOnwers), response);

export default router;
