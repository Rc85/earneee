import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { OffersInterface } from '../../../../_shared/types';

export const retrieveOffers = (options?: { offerId?: string; status?: string }) => {
  return useQuery<{ data: { offers: OffersInterface[] } }>({
    queryKey: ['offers', options?.offerId, options?.status],
    queryFn: () =>
      axios({
        method: 'get',
        url: '/api/v1/offer/retrieve',
        params: options,
        withCredentials: true
      })
  });
};
