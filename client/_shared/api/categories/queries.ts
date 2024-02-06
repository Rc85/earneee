import axios from 'axios';
import { useQuery } from 'react-query';
import { CategoriesInterface } from '../../../../_shared/types';

export const retrieveCategories = (options: { categoryId?: number; parentId?: number | null }) => {
  return useQuery<{ data: { categories: CategoriesInterface[] } }>(
    ['categories', options.categoryId, options.parentId],
    () =>
      axios({
        method: 'get',
        url: '/api/v1/category/retrieve',
        params: options,
        withCredentials: true
      })
  );
};
