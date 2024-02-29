import { ProductOptionsInterface, ProductSpecificationsInterface } from '.';
import { CategoriesInterface } from './categories';
import { ProductMediaInterface } from './product_media';
import { ProductUrlsInterface } from './product_urls';
import { ProductVariantsInterface } from './product_variants';

export interface ProductsInterface {
  id: string;
  name: string;
  price: number | null;
  currency: string | null;
  categoryId: number;
  brandId: string | null;
  excerpt: string | null;
  description: string | null;
  about: string | null;
  details: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  category?: CategoriesInterface;
  media?: ProductMediaInterface[];
  variants?: ProductVariantsInterface[];
  ancestors?: { id: number; name: string }[];
  urls?: ProductUrlsInterface[];
  specifications?: ProductSpecificationsInterface[];
  options?: ProductOptionsInterface[];
}
