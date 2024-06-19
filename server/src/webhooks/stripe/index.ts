import express from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import { checkoutWebhook } from './checkout';
import { refundWebhook } from './refund';

const router = express.Router();

router.post('/webhooks/stripe/checkout', dbConnect, middleware(checkoutWebhook), response);

router.post('/webhooks/stripe/refund', dbConnect, middleware(refundWebhook), response);

export default router;
