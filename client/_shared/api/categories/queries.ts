import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { CategoriesInterface } from '../../../../_shared/types';

export const retrieveCategories = (options?: {
  categoryId?: number;
  parentId?: number | null;
  hasProducts?: boolean;
  withAncestors?: boolean;
}) => {
  return useQuery<{ categories: CategoriesInterface[] }>({
    queryKey: [
      'categories',
      options?.categoryId,
      options?.parentId,
      options?.hasProducts,
      options?.withAncestors
    ],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/category',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const listCategories = () => {
  return useQuery<{ categories: CategoriesInterface[][] }>({
    queryKey: ['categories list'],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/category/list',
        withCredentials: true
      });

      return data;
    }
  });
};
