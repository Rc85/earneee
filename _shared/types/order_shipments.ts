import { OrderItemsInterface } from '.';

export interface OrderShipmentsInterface {
  id: string;
  orderId: string;
  shippingProvider: string | null;
  trackingNumber: string | null;
  eta: string | null;
  createdAt: string;
  updatedAt: string | null;
  items?: OrderItemsInterface[];
}
