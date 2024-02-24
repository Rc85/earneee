import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import { addAffiliate } from './controllers/add';
import { validateAddAffiliate } from './controllers';
import { retrieveAffiliates } from './controllers';
import { deleteAffiliate } from './controllers/delete';

const router = Router();

router.post(
  '/v1/auth/admin/affiliate',
  dbConnect,
  middleware(validateAddAffiliate),
  middleware(addAffiliate),
  response
);

router.get('/v1/affiliate', dbConnect, middleware(retrieveAffiliates), response);

router.delete('/v1/auth/admin/affiliate', dbConnect, middleware(deleteAffiliate), response);

export default router;
