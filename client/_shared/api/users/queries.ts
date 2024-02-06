import axios from 'axios';
import { useQuery } from 'react-query';
import { UserProfilesInterface } from '../../../../_shared/types';

export const retrieveUserProfiles = (options?: { userId: string; offset?: number; limit?: number }) => {
  return useQuery<{ data: { userProfiles: UserProfilesInterface[]; count: number } }>(
    ['user profiles', options?.userId, options?.limit, options?.offset],
    () =>
      axios({
        method: 'get',
        url: '/api/v1/auth/admin/profile/retrieve',
        params: options,
        withCredentials: true
      })
  );
};
