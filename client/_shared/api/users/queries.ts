import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { UserProfilesInterface } from '../../../../_shared/types';

export const retrieveUserProfiles = (options?: { userId: string; offset?: number; limit?: number }) => {
  return useQuery<{ data: { userProfiles: UserProfilesInterface[]; count: number } }>({
    queryKey: ['user profiles', options?.userId, options?.limit, options?.offset],
    queryFn: () =>
      axios({
        method: 'get',
        url: '/api/v1/auth/admin/profile/retrieve',
        params: options,
        withCredentials: true
      })
  });
};
