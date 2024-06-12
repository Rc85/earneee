import { useQuery } from '@tanstack/react-query';
import { OrdersInterface } from '../../../../_shared/types';
import axios from 'axios';

export const retrieveCart = (options: { userId: string | undefined }) => {
  return useQuery<{ order: OrdersInterface }>({
    queryKey: ['cart', options.userId],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/auth/user/cart',
        params: options,
        withCredentials: true
      });

      return data;
    },
    refetchOnWindowFocus: true
  });
};
