import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.get('/api/v1/product/retrieve', dbConnect, middleware(controllers.retrieveProducts), response);

router.post(
  '/api/v1/auth/admin/product/create',
  dbConnect,
  middleware(controllers.validateCreateProduct),
  middleware(controllers.createProduct),
  response
);

router.delete(
  '/api/v1/auth/admin/product/delete',
  dbConnect,
  middleware(controllers.deleteProduct),
  response
);

export default router;
