import { OptionSelectionsInterface } from '.';

export interface ProductOptionsInterface {
  id: string;
  name: string;
  productId: string | null;
  variantId: string | null;
  required: boolean;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  selections?: OptionSelectionsInterface[];
}
