import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post(
  '/v1/auth/admin/product/media/add',
  dbConnect,
  middleware(controllers.validateAddProductMedia),
  middleware(controllers.addProductMedia),
  response
);

router.get('/v1/product/media', dbConnect, middleware(controllers.retrieveProductMedia), response);

router.put(
  '/v1/auth/admin/product/media',
  dbConnect,
  middleware(controllers.validateSortProductMedia),
  middleware(controllers.sortProductMedia),
  response
);

router.delete(
  '/v1/auth/admin/product/media',
  dbConnect,
  middleware(controllers.deleteProductMedia),
  response
);

router.post(
  '/v1/auth/admin/product/media/upload',
  dbConnect,
  upload.any(),
  middleware(controllers.uploadProductMedia),
  response
);

router.put(
  '/v1/auth/admin/product/media',
  dbConnect,
  middleware(controllers.validateUpdateProductMedia),
  middleware(controllers.updateProductMedia),
  response
);

export default router;
