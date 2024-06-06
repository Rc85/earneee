import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.get('/v1/statuses', dbConnect, middleware(controllers.retrieveStatuses), response);

router.post('/v1/statuses', dbConnect, middleware(controllers.createStatus), response);

export default router;
