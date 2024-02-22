import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/api/v1/auth/admin/offer',
  dbConnect,
  middleware(controllers.validateCreateOffer),
  middleware(controllers.createOffer),
  response
);

router.get('/api/v1/offer', dbConnect, middleware(controllers.retrieveOffers), response);

router.delete('/api/v1/auth/admin/offer', dbConnect, middleware(controllers.deleteOffer), response);

router.put(
  '/api/v1/auth/admin/offer',
  dbConnect,
  middleware(controllers.validateSortOffers),
  middleware(controllers.sortOffers),
  response
);

export default router;
