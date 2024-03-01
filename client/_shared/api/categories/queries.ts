import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { CategoriesInterface } from '../../../../_shared/types';

export const retrieveCategories = (options?: {
  categoryId?: number;
  parentId?: number | null;
  hasProducts?: boolean;
}) => {
  return useQuery<{ categories: CategoriesInterface[] }>({
    queryKey: ['categories', options?.categoryId, options?.parentId, options?.hasProducts],
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
