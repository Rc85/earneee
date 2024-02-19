import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { UserProfilesInterface, UsersInterface } from '../../../../_shared/types';

export const retrieveUserProfiles = (options?: { userId: string; offset?: number; limit?: number }) => {
  return useQuery<{ userProfiles: UserProfilesInterface[]; count: number }>({
    queryKey: ['user profiles', options?.userId, options?.limit, options?.offset],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/api/v1/auth/admin/profile/retrieve',
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
        url: '/api/v1/auth/admin/user/retrieve',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};
