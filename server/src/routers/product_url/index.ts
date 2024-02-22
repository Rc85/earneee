import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/api/v1/auth/admin/product/url',
  dbConnect,
  middleware(controllers.validateCreateProductUrl),
  middleware(controllers.createProductUrl),
  response
);

router.get('/api/v1/product/url', dbConnect, middleware(controllers.retrieveProductUrl), response);

router.delete(
  '/api/v1/auth/admin/product/url',
  dbConnect,
  middleware(controllers.deleteProductUrl),
  response
);

export default router;
