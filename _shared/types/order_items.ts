import { ProductsInterface } from './products';
import { OrderShipmentsInterface } from './order_shipments';

export interface OrderItemsInterface {
  id: string;
  name: string;
  orderId: string;
  product: ProductsInterface;
  price: number;
  quantity: number;
  orderShipmentId: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  shipment?: OrderShipmentsInterface;
}
