import { OrderItemsInterface } from './order_items';

export interface OrdersInterface {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  items: OrderItemsInterface[];
}
