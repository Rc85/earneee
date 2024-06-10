export interface CategoriesInterface {
  id: number;
  name: string;
  parentId: number | null;
  status: string;
  ordinance: number;
  createdAt: string;
  updatedAt: string | null;
  subcategories?: CategoriesInterface[];
  ancestors?: CategoriesInterface[];
}
