import axios from 'axios';
import { useQuery } from 'react-query';
import { AffiliatesInterface } from '../../../../_shared/types';

export const retrieveAffiliates = (options: { affiliateId?: string; offset?: number }) => {
  return useQuery<{ data: { affiliates: AffiliatesInterface[]; count: number } }>(
    ['affiliates', options.affiliateId, options.offset],
    () =>
      axios({
        method: 'get',
        url: '/api/v1/affiliates/retrieve',
        params: options,
        withCredentials: true
      })
  );
};
