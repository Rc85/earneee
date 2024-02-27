import { ProductSpecificationsInterface, ProductUrlsInterface } from '.';
import { ProductMediaInterface } from './product_media';
import { ProductOptionsInterface } from './product_options';
import { ProductsInterface } from './products';

export interface ProductVariantsInterface {
  id: string;
  name: string;
  productId: string;
  featured: boolean;
  description: string | null;
  about: string | null;
  details: string | null;
  ordinance: number;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  options?: ProductOptionsInterface[];
  media?: ProductMediaInterface[];
  product?: ProductsInterface;
  specifications?: ProductSpecificationsInterface[];
  urls?: ProductUrlsInterface[];
}
