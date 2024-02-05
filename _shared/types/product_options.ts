import { OptionSelectionsInterface } from '.';

export interface ProductOptionsInterface {
  id: string;
  name: string;
  variantId: string;
  required: boolean;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  selections?: OptionSelectionsInterface[];
}
