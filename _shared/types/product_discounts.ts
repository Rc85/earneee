export interface ProductDiscountsInterface {
  id: string;
  amount: number;
  amountType: string;
  status: string;
  productId: string;
  startsAt: string | null;
  endsAt: string | null;
  createdAt: string;
  updatedAt: string | null;
}
