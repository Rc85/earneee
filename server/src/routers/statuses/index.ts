import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.get('/api/v1/statuses', dbConnect, middleware(controllers.retrieveStatuses), response);

router.post('/api/v1/statuses', dbConnect, middleware(controllers.createStatus), response);

export default router;
