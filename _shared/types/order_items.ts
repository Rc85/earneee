import { ProductsInterface } from './products';
import { OrderShipmentsInterface } from './order_shipments';
import { RefundsInterface } from './refunds';
import { OrdersInterface } from './orders';

export interface OrderItemsInterface {
  id: string;
  name: string;
  orderId: string;
  product: ProductsInterface;
  price: number;
  quantity: number;
  orderShipmentId: string | null;
  status: string;
  deliveredAt: string | null;
  createdAt: string;
  updatedAt: string | null;
  shipment?: OrderShipmentsInterface;
  refunds?: RefundsInterface[];
  order?: OrdersInterface;
}
