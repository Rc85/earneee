import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/api/v1/auth/admin/category',
  dbConnect,
  middleware(controllers.validateCreateCategory),
  middleware(controllers.createCategory),
  response
);

router.get('/api/v1/category', dbConnect, middleware(controllers.retrieveCategories), response);

router.put('/api/v1/auth/admin/category', dbConnect, middleware(controllers.sortCategories), response);

router.delete('/api/v1/auth/admin/category', dbConnect, middleware(controllers.deleteCategory), response);

export default router;
