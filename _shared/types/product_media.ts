export interface ProductMediaInterface {
  id: string;
  url: string;
  path: string | null;
  productId: string | null;
  width: number;
  height: number;
  sizing: string;
  useAsThumbnail: boolean;
  type: string;
  ordinance: number;
  createdAt: string;
  status: string;
  updatedAt: string | null;
}
