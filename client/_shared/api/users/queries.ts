import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  OrdersInterface,
  UserMessagesInterface,
  UserProfilesInterface,
  UsersInterface
} from '../../../../_shared/types';

export const retrieveUserProfiles = (options?: { userId?: string; offset?: number; limit?: number }) => {
  return useQuery<{ userProfiles: UserProfilesInterface[]; count: number }>({
    queryKey: ['user profiles', options?.userId, options?.limit, options?.offset],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/auth/admin/profiles',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveUsers = (options?: { offset?: number; limit?: number }) => {
  return useQuery<{ users: UsersInterface[]; count: number }>({
    queryKey: ['users', options?.limit, options?.offset],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/auth/admin/user',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveUserProfile = () => {
  return useQuery<{ userProfile: UserProfilesInterface }>({
    queryKey: ['user profile'],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: `/v1/auth/user/profile`,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveMessages = (offset: number, limit?: number) => {
  return useQuery<{ messages: UserMessagesInterface[]; count: number }>({
    queryKey: ['user messages', offset, limit],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: `/v1/auth/user/messages`,
        withCredentials: true,
        params: { offset, limit }
      });

      return data;
    }
  });
};

export const retrieveMessageCount = (enabled: boolean) => {
  return useQuery<{ count: number }>({
    queryKey: ['user messages count'],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: `/v1/auth/user/messages/count`,
        withCredentials: true
      });

      return data;
    },
    enabled
  });
};

export const retrieveOrders = (options: { offset: number; limit: number }) => {
  return useQuery<{ orders: OrdersInterface[]; count: number }>({
    queryKey: ['user orders', options.offset, options.limit],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: `/v1/auth/user/orders`,
        withCredentials: true,
        params: options
      });

      return data;
    }
  });
};
