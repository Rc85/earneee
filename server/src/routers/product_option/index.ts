import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.get('/v1/auth/admin/product/option', dbConnect, middleware(controllers.retrieveOptions), response);

router.post(
  '/v1/auth/admin/product/option',
  dbConnect,
  middleware(controllers.validateCreateOption),
  middleware(controllers.createOption),
  response
);

export default router;
