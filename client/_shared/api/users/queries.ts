import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { UserProfilesInterface, UsersInterface } from '../../../../_shared/types';

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
