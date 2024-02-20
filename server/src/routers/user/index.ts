import { Router } from 'express';
import { dbConnect, middleware, recaptcha, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/api/v1/user',
  middleware(recaptcha),
  dbConnect,
  middleware(controllers.validateCreateUser),
  middleware(controllers.createUser),
  response
);

router.put(
  '/api/v1/user',
  dbConnect,
  middleware(controllers.validateUpdateUser),
  middleware(controllers.updateUser),
  response
);

router.post(
  /^\/api\/v1\/auth\/(admin|user)\/login/,
  dbConnect,
  middleware(controllers.validateLogin),
  middleware(controllers.login),
  response
);

router.post(/^\/api\/v1\/auth\/(admin|user)$/, middleware(controllers.authenticate), response);

router.post(/^\/api\/v1\/auth\/(admin|user)\/logout/, dbConnect, middleware(controllers.logout), response);

router.post(
  /^\/api\/v1\/auth\/(admin|user)\/password\/change/,
  dbConnect,
  middleware(controllers.validateChangePassword),
  middleware(controllers.changePassword),
  response
);

router.get(
  /^\/api\/v1\/auth\/(admin|user)\/profile\/retrieve/,
  dbConnect,
  middleware(controllers.retrieveUserProfiles),
  response
);

router.post('/api/v1/password/reset', dbConnect, middleware(controllers.resetPassword), response);

router.post(
  '/api/v1/contact',
  dbConnect,
  middleware(recaptcha),
  middleware(controllers.validateContact),
  middleware(controllers.contact),
  response
);

router.get('/api/v1/auth/admin/user/retrieve', dbConnect, middleware(controllers.retrieveUsers), response);

router.post(
  '/api/v1/subscribe',
  dbConnect,
  middleware(recaptcha),
  middleware(controllers.validateSubscribe),
  middleware(controllers.subscribe),
  response
);

export default router;
