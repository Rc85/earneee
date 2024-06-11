import { Router } from 'express';
import { dbConnect, middleware, recaptcha, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.post(
  '/v1/user',
  middleware(recaptcha),
  dbConnect,
  middleware(controllers.validateCreateUser),
  middleware(controllers.createUser),
  response
);

router.put(
  '/v1/user',
  dbConnect,
  middleware(controllers.validateUpdateUser),
  middleware(controllers.updateUser),
  response
);

router.patch(
  '/v1/user',
  dbConnect,
  middleware(controllers.validateActivateAccount),
  middleware(controllers.activateAccount),
  response
);

router.post(
  /^\/v1\/auth\/(admin|user)\/login/,
  dbConnect,
  middleware(controllers.validateLogin),
  middleware(controllers.login),
  response
);

router.post(/^\/v1\/auth\/(admin|user)$/, middleware(controllers.authenticate), response);

router.post(/^\/v1\/auth\/(admin|user)\/logout/, dbConnect, middleware(controllers.logout), response);

router.put(
  /^\/v1\/auth\/(admin|user)\/password/,
  dbConnect,
  middleware(controllers.validateChangePassword),
  middleware(controllers.changePassword),
  response
);

router.get(
  /^\/v1\/auth\/(admin|user)\/profiles/,
  dbConnect,
  middleware(controllers.retrieveUserProfiles),
  response
);

router.post('/v1/password/reset', dbConnect, middleware(controllers.resetPassword), response);

router.post(
  '/v1/contact',
  dbConnect,
  middleware(recaptcha),
  middleware(controllers.validateContact),
  middleware(controllers.contact),
  response
);

router.get('/v1/auth/admin/user', dbConnect, middleware(controllers.retrieveUsers), response);

router.post(
  '/v1/subscribe',
  dbConnect,
  middleware(recaptcha),
  middleware(controllers.validateSubscribe),
  middleware(controllers.subscribe),
  response
);

router.get('/v1/auth/user/profile', dbConnect, middleware(controllers.retrieveUserProfile), response);

router.put(
  '/v1/auth/user/profile',
  dbConnect,
  middleware(controllers.validateUpdateProfile),
  middleware(controllers.updateProfile),
  response
);

router.get('/v1/auth/user/messages/count', dbConnect, middleware(controllers.retrieveMessageCount), response);

router.get('/v1/auth/user/messages', dbConnect, middleware(controllers.retrieveMessages), response);

router.put('/v1/auth/user/messages', dbConnect, middleware(controllers.updateMessage), response);

router.delete(
  '/v1/auth/user/messages',
  dbConnect,
  middleware(controllers.validateDeleteMessages),
  middleware(controllers.deleteMessages),
  response
);

router.get('/v1/auth/user/orders', dbConnect, middleware(controllers.retrieveOrders), response);

export default router;
