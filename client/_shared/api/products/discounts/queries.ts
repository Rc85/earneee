import { useQuery } from '@tanstack/react-query';
import { ProductDiscountsInterface } from '../../../../../_shared/types';
import axios from 'axios';

export const retrieveProductDiscounts = (options: { productId: string }) => {
  return useQuery<{ discounts: ProductDiscountsInterface[] }>({
    queryKey: ['discounts', options.productId],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/auth/admin/product/discount',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};
