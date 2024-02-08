import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { AffiliatesInterface } from '../../../../_shared/types';

export const retrieveAffiliates = (options?: { affiliateId?: string; offset?: number }) => {
  return useQuery<{ data: { affiliates: AffiliatesInterface[]; count: number } }>({
    queryKey: ['affiliates', options?.affiliateId, options?.offset],
    queryFn: () =>
      axios({
        method: 'get',
        url: '/api/v1/affiliate/retrieve',
        params: options,
        withCredentials: true
      })
  });
};
