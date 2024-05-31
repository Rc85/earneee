import { ProductSpecificationsInterface } from './product_specifications';
import { CategoriesInterface } from './categories';
import { ProductMediaInterface } from './product_media';
import { ProductVariantsInterface } from './product_variants';
import { ProductBrandsInterface } from './product_brands';

export interface ProductsInterface {
  id: string;
  name: string;
  categoryId: number;
  type: string;
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
  brand?: ProductBrandsInterface;
  specifications?: ProductSpecificationsInterface[];
}
