import { OrderItemsInterface } from './order_items';
import { OrderShipmentsInterface } from './order_shipments';

export interface OrdersInterface {
  id: string;
  userId: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  items: OrderItemsInterface[];
  shipment?: OrderShipmentsInterface;
}
