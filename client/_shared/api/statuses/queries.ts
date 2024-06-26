import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { StatusesInterface } from '../../../../_shared/types';

export const retrieveStatuses = (options?: { name: string }) => {
  return useQuery<{ statuses: StatusesInterface[] }>({
    queryKey: ['statuses', options?.name],
    queryFn: async () => {
      const { data } = await axios({
        url: '/v1/statuses',
        method: 'get',
        params: { name: options?.name },
        withCredentials: true
      });

      return data;
    }
  });
};
