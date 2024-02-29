export interface ProductSpecificationsInterface {
  id: string;
  name: string;
  value: string;
  productId: string | null;
  variantId: string | null;
  ordinance: number | null;
  createdAt: string;
  updatedAt: string | null;
}
