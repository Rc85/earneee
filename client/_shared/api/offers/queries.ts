import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { OffersInterface } from '../../../../_shared/types';

export const retrieveOffers = (options?: { offerId: string }) => {
  return useQuery<{ data: { offers: OffersInterface[] } }>({
    queryKey: ['offers', options?.offerId],
    queryFn: () =>
      axios({
        method: 'get',
        url: '/api/v1/offer/retrieve',
        params: options,
        withCredentials: true
      })
  });
};
