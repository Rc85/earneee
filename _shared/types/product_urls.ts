import { AffiliatesInterface } from './affiliates';

export interface ProductUrlsInterface {
  id: string;
  variantId: string;
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
