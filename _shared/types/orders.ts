import { OrderItemsInterface } from './order_items';
import { OrderShipmentsInterface } from './order_shipments';

export interface OrdersInterface {
  id: string;
  number: string;
  userId: string;
  sessionId: string | null;
  receiptUrl: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  items: OrderItemsInterface[];
  shipment?: OrderShipmentsInterface;
}
