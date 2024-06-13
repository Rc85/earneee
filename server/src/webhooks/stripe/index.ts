import express from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import { checkoutWebhook } from './checkout';

const router = express.Router();

router.post(
  '/webhooks/stripe/checkout',
  dbConnect,
  express.raw({ type: 'application/json' }),
  middleware(checkoutWebhook),
  response
);

export default router;
