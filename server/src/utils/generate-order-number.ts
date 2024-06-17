import { PoolClient } from 'pg';
import { generateKey } from '../../../_shared/utils/generate-key';
import { database } from '../middlewares/database';
import { OrdersInterface } from '../../../_shared/types';

export const generateOrderNumber = async (userId: string, client?: PoolClient): Promise<string> => {
  const orderNumber = generateKey(1, 3).toUpperCase() + '-' + generateKey(1, 3).toUpperCase();

  const order = await database.retrieve<OrdersInterface[]>('SELECT id FROM orders', {
    where: 'user_id = $1 AND number = $2',
    params: [userId, orderNumber],
    client
  });

  if (order.length) {
    return await generateOrderNumber(userId, client);
  }

  return orderNumber;
};
