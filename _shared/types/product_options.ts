import { OptionSelectionsInterface } from '.';

export interface ProductOptionsInterface {
  id: string;
  name: string;
  description: string | null;
  productId: string;
  minimumSelections: number;
  maximumSelections: number | null;
  required: boolean;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  selections?: OptionSelectionsInterface[];
}
