import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/v1/auth/admin/product/url',
  dbConnect,
  middleware(controllers.validateCreateProductUrl),
  middleware(controllers.createProductUrl),
  response
);

router.get('/v1/product/url', dbConnect, middleware(controllers.retrieveProductUrl), response);

router.delete('/v1/auth/admin/product/url', dbConnect, middleware(controllers.deleteProductUrl), response);

export default router;
