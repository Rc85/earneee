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

export const listOrders = (options: { page: number; limit: number }) => {
  return useQuery<{ orders: OrdersInterface[]; count: number }>({
    queryKey: ['admin orders', options.page, options.limit],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/auth/admin/orders',
        params: options,
        withCredentials: true
      });

      return data;
    },
    refetchOnWindowFocus: true
  });
};

export const retrieveOrder = (options: { orderId: string | undefined }) => {
  return useQuery<{ order: OrdersInterface }>({
    queryKey: ['admin order', options.orderId],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/auth/admin/order',
        params: options,
        withCredentials: true
      });

      return data;
    },
    refetchOnWindowFocus: true
  });
};
