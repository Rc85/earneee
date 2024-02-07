import { Router } from 'express';
import { dbConnect, middleware, response } from '../../middlewares';
import * as controllers from './controllers';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

router.post(
  '/api/v1/auth/admin/product/media/add',
  dbConnect,
  middleware(controllers.validateAddProductMedia),
  middleware(controllers.addProductMedia),
  response
);

router.get(
  '/api/v1/product/media/retrieve',
  dbConnect,
  middleware(controllers.retrieveProductMedia),
  response
);

router.put(
  '/api/v1/auth/admin/product/media/sort',
  dbConnect,
  middleware(controllers.validateSortProductMedia),
  middleware(controllers.sortProductMedia),
  response
);

router.delete(
  '/api/v1/auth/admin/product/media/delete',
  dbConnect,
  middleware(controllers.deleteProductMedia),
  response
);

router.post(
  '/api/v1/auth/admin/product/media/upload',
  dbConnect,
  upload.any(),
  middleware(controllers.uploadProductMedia),
  response
);

router.put(
  '/api/v1/auth/admin/product/media/update',
  dbConnect,
  middleware(controllers.validateUpdateProductMedia),
  middleware(controllers.updateProductMedia),
  response
);

export default router;
