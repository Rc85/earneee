export interface RefundsInterface {
  id: string;
  orderItemId: string;
  amount: number;
  quantity: number;
  reason: string | null;
  refundId: string | null;
  reference: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
}
