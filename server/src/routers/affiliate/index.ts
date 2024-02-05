import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import { addAffiliate } from './controllers/add';
import { validateAddAffiliate } from './controllers';
import { retrieveAffiliates } from './controllers/retrieve';
import { deleteAffiliate } from './controllers/delete';

const router = Router();

router.post(
  '/api/v1/auth/admin/affiliates/add',
  dbConnect,
  middleware(validateAddAffiliate),
  middleware(addAffiliate),
  response
);

router.get('/api/v1/affiliates/retrieve', dbConnect, middleware(retrieveAffiliates), response);

router.delete('/api/v1/auth/admin/affiliates/delete', dbConnect, middleware(deleteAffiliate), response);

export default router;
