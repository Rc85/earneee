import { ProductBrandUrlsInterface } from '.';

export interface ProductBrandsInterface {
  id: string;
  name: string;
  logoUrl: string | null;
  logoPath: string | null;
  owner: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  urls?: ProductBrandUrlsInterface[];
}
