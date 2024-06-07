import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ProductOptionsInterface } from '../../../../../_shared/types';

export const retrieveProductOptions = (options?: { productId?: string; variantId?: string }) => {
  return useQuery<{ options: ProductOptionsInterface[] }>({
    queryKey: ['options', options?.variantId],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/product/option',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};
