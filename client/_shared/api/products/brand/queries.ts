import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ProductBrandsInterface } from '../../../../../_shared/types';

export const retrieveProductBrands = (options?: { brandId: string; offset?: number }) => {
  return useQuery<{ brands: ProductBrandsInterface[]; count: number }>({
    queryKey: ['brands', options?.brandId, options?.offset],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/product/brand',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};
