import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ProductMediaInterface } from '../../../../../_shared/types';

export const retrieveProductMedia = (options?: { variantId?: string; productId?: string }) => {
  return useQuery<{ media: ProductMediaInterface[] }>({
    queryKey: ['product media', options?.productId, options?.variantId],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/product/media',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};
