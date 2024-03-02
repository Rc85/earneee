import { AffiliatesInterface, ProductSpecificationsInterface, ProductUrlsInterface } from '.';
import { ProductMediaInterface } from './product_media';
import { ProductOptionsInterface } from './product_options';
import { ProductsInterface } from './products';

export interface ProductVariantsInterface {
  id: string;
  name: string;
  price?: number | null;
  currency?: string | null;
  productId: string;
  featured: boolean;
  excerpt: string | null;
  description: string | null;
  about: string | null;
  details: string | null;
  ordinance: number;
  status: string;
  country?: string | null;
  url?: string | null;
  type?: string | null;
  createdAt: string;
  updatedAt: string | null;
  options?: ProductOptionsInterface[];
  media?: ProductMediaInterface[];
  product?: ProductsInterface;
  specifications?: ProductSpecificationsInterface[];
  urls?: ProductUrlsInterface[];
  affiliate?: AffiliatesInterface;
}
