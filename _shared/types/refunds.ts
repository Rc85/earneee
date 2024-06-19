import { OrderItemsInterface } from './order_items';
import { RefundPhotosInterface } from './refund_photos';

export interface RefundsInterface {
  id: string;
  orderItemId: string;
  amount: number;
  quantity: number;
  reason: string | null;
  refundId: string | null;
  reference: string | null;
  notes: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  item?: OrderItemsInterface;
  photos?: RefundPhotosInterface[];
}
