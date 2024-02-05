import axios from 'axios';
import { useQuery } from 'react-query';
import { OffersInterface } from '../../../../_shared/types';

export const retrieveOffers = (options?: { offerId: string }) => {
  return useQuery<{ data: { offers: OffersInterface[] } }>(['offers', options?.offerId], () =>
    axios({
      method: 'get',
      url: '/api/v1/offers/retrieve',
      params: options,
      withCredentials: true
    })
  );
};
