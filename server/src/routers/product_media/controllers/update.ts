import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import { ProductsInterface } from '../../../../../_shared/types';

export const updateProductMedia = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, status, sizing, useAsThumbnail, productId } = req.body;

  if (useAsThumbnail) {
    const product = await database.retrieve<ProductsInterface[]>('SELECT * FROM products', {
      where: 'id = $1',
      params: [productId],
      client
    });

    await database.update('product_media', ['use_as_thumbnail'], {
      where: 'use_as_thumbnail IS true AND product_id = $2',
      params: [false, productId],
      client
    });

    console.log(productId, product[0].parentId);

    if (product[0].parentId) {
      await database.update('product_media', ['use_as_thumbnail'], {
        where: 'use_as_thumbnail IS true AND product_id = $2',
        params: [false, product[0].parentId],
        client
      });
    } else {
      const products = await database.retrieve<ProductsInterface[]>('SELECT * FROM products', {
        where: 'parent_id = $1',
        params: [productId],
        client
      });
      const productIds = products.map((product) => product.id);

      await database.update('product_media', ['use_as_thumbnail'], {
        where: 'use_as_thumbnail IS true AND product_id = ANY($2)',
        params: [false, productIds],
        client
      });
    }
  }

  await database.update('product_media', ['status', 'sizing', 'use_as_thumbnail'], {
    where: 'id = $4',
    params: [status, sizing || 'contain', useAsThumbnail, id],
    client
  });

  return next();
};
