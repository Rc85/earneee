import { CategoriesInterface } from './categories';
import { ProductMediaInterface } from './product_media';
import { ProductVariantsInterface } from './product_variants';

export interface ProductsInterface {
  id: string;
  name: string;
  categoryId: number;
  brandId: string | null;
  excerpt: string | null;
  description: string | null;
  type: string;
  status: string;
  createdAt: string;
  updatedAt: string | null;
  category?: CategoriesInterface;
  media?: ProductMediaInterface[];
  variants?: ProductVariantsInterface[];
  ancestors?: { id: number; name: string }[];
}
