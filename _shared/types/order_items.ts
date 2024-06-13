import { ProductsInterface } from './products';

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
}
