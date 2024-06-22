import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/v1/auth/admin/faq',
  dbConnect,
  middleware(controllers.validateCreateQuestion),
  middleware(controllers.createQuestion),
  response
);

router.get('/v1/faq', dbConnect, middleware(controllers.retrieveFaqs), response);

router.delete('/v1/auth/admin/faq', dbConnect, middleware(controllers.deleteQuestion), response);

export default router;
