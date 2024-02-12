import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { CategoriesInterface } from '../../../../_shared/types';

export const retrieveCategories = (options?: {
  categoryId?: number;
  parentId?: number | null;
  level?: number;
}) => {
  return useQuery<{ data: { categories: CategoriesInterface[] } }>({
    queryKey: ['categories', options?.categoryId, options?.parentId, options?.level],
    queryFn: () =>
      axios({
        method: 'get',
        url: '/api/v1/category/retrieve',
        params: options,
        withCredentials: true
      })
  });
};
