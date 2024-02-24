import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { AffiliatesInterface } from '../../../../_shared/types';

export const retrieveAffiliates = (options?: { affiliateId?: string; offset?: number }) => {
  return useQuery<{ affiliates: AffiliatesInterface[]; count: number }>({
    queryKey: ['affiliates', options?.affiliateId, options?.offset],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/affiliate',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};
