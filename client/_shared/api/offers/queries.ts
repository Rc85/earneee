import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { OffersInterface } from '../../../../_shared/types';

export const retrieveOffers = (options?: { offerId?: string; status?: string }) => {
  return useQuery<{ offers: OffersInterface[] }>({
    queryKey: ['offers', options?.offerId, options?.status],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/offer',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};
