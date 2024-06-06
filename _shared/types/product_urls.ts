import { AffiliatesInterface } from './affiliates';

export interface ProductUrlsInterface {
  id: string;
  productId: string;
  variantId: string | null;
  url: string;
  country: string;
  price: number;
  type: string;
  affiliateId: string | null;
  currency: string;
  createdAt: string;
  updatedAt: string | null;
  affiliate?: AffiliatesInterface;
}
