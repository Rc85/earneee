export interface CategoriesInterface {
  id: number;
  name: string;
  type: string | null;
  parentId: number | null;
  status: string;
  ordinance: number;
  createdAt: string;
  updatedAt: string | null;
  subcategories?: CategoriesInterface[];
}
