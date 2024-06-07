import { ProductSpecificationsInterface } from './product_specifications';
import { CategoriesInterface } from './categories';
import { ProductMediaInterface } from './product_media';
import { ProductBrandsInterface } from './product_brands';
import { ProductUrlsInterface } from '.';

export interface ProductsInterface {
  id: string;
  name: string;
  categoryId: number;
  brandId: string | null;
  parentId: string | null;
  ordinance: number | null;
  excerpt: string | null;
  description: string | null;
  about: string | null;
  featured: boolean;
  details: string | null;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  category?: CategoriesInterface;
  media?: ProductMediaInterface[];
  ancestors?: { id: number; name: string }[];
  brand?: ProductBrandsInterface;
  specifications?: ProductSpecificationsInterface[];
  urls?: ProductUrlsInterface[];
  product?: ProductsInterface;
  variants?: ProductsInterface[];
}
