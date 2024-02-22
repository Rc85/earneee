import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/api/v1/auth/admin/product/option',
  dbConnect,
  middleware(controllers.validateCreateProductOption),
  middleware(controllers.createProductOption),
  response
);

router.get('/api/v1/product/option', dbConnect, middleware(controllers.retrieveProductOption), response);

router.delete(
  '/api/v1/auth/admin/product/option',
  dbConnect,
  middleware(controllers.deleteProductOption),
  response
);

export default router;
