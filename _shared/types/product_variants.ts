import { ProductSpecificationsInterface } from '.';
import { ProductMediaInterface } from './product_media';
import { ProductOptionsInterface } from './product_options';
import { ProductsInterface } from './products';

export interface ProductVariantsInterface {
  id: string;
  name: string;
  price: number;
  productId: string;
  featured: boolean;
  description: string | null;
  ordinance: number;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  options?: ProductOptionsInterface[];
  media?: ProductMediaInterface[];
  product?: ProductsInterface;
  specifications?: ProductSpecificationsInterface[];
}
