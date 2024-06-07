export interface ProductDiscountsInterface {
  id: string;
  amount: number;
  amountType: string;
  status: string;
  productUrlId: string;
  startsAt: string | null;
  endsAt: string | null;
  limitedTimeOnly: boolean;
  createdAt: string;
  updatedAt: string | null;
}
