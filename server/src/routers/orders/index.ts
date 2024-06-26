import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';

const router = Router();

router.get('/v1/auth/user/cart', dbConnect, middleware(controllers.retrieveCart), response);

router.post(
  '/v1/auth/user/cart/item',
  dbConnect,
  middleware(controllers.validateAddProduct),
  middleware(controllers.addProduct),
  response
);

router.delete(
  '/v1/auth/user/cart/item',
  dbConnect,
  middleware(controllers.validateRemoveProduct),
  middleware(controllers.removeProduct),
  response
);

router.post(
  '/v1/auth/user/cart/checkout',
  dbConnect,
  middleware(controllers.validateCheckout),
  middleware(controllers.checkout),
  response
);

router.get('/v1/auth/admin/orders', dbConnect, middleware(controllers.listOrders), response);

router.get('/v1/auth/admin/order', dbConnect, middleware(controllers.retrieveOrder), response);

router.put('/v1/auth/admin/order', dbConnect, middleware(controllers.updateOrder), response);

router.post(
  '/v1/auth/admin/order/shipment',
  dbConnect,
  middleware(controllers.validateCreateOrderShipment),
  middleware(controllers.createShipment),
  response
);

router.put(
  '/v1/auth/admin/order/item',
  dbConnect,
  middleware(controllers.validateUpdateOrderItem),
  middleware(controllers.updateOrderItem),
  response
);

router.patch(
  '/v1/auth/admin/order/item',
  dbConnect,
  middleware(controllers.validateRefundOrderItem),
  middleware(controllers.refundOrderItem),
  response
);

router.get('/v1/auth/admin/refunds', dbConnect, middleware(controllers.listRefunds), response);

router.post(
  '/v1/auth/admin/refund',
  dbConnect,
  middleware(controllers.validateUpdateRefund),
  middleware(controllers.updateRefund),
  response
);

router.patch(
  '/v1/auth/admin/refund',
  dbConnect,
  middleware(controllers.validateUpdateRefundNotes),
  middleware(controllers.updateRefundNotes),
  response
);

router.post(
  '/v1/auth/admin/refund/photo',
  dbConnect,
  middleware(controllers.validateUploadRefundPhotos),
  middleware(controllers.uploadRefundPhotos),
  response
);

router.delete('/v1/auth/admin/refund/photo', dbConnect, middleware(controllers.deleteRefundPhoto), response);

export default router;
