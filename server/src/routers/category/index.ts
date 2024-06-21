import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/v1/auth/admin/category',
  dbConnect,
  middleware(controllers.validateCreateCategory),
  middleware(controllers.createCategory),
  response
);

router.get('/v1/category', dbConnect, middleware(controllers.retrieveCategories), response);

router.put('/v1/auth/admin/category', dbConnect, middleware(controllers.sortCategories), response);

router.delete('/v1/auth/admin/category', dbConnect, middleware(controllers.deleteCategory), response);

router.get('/v1/category/list', dbConnect, middleware(controllers.listCategories), response);

router.get('/v1/category/recent', dbConnect, middleware(controllers.retrieveMostRecent), response);

export default router;
