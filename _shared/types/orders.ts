import Stripe from 'stripe';
import { OrderItemsInterface } from './order_items';

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
  details?: Stripe.Response<Stripe.Checkout.Session>;
}
