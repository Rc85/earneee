import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaqsInterface } from '../../../../_shared/types';

export const retrieveFaqs = (options: { questionId?: string; enabled: boolean }) => {
  return useQuery<{ questions: FaqsInterface[] }>({
    queryKey: ['faqs', options?.questionId, options?.enabled],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/faq',
        params: options,
        withCredentials: true
      });

      return data;
    },
    enabled: Boolean(options?.enabled)
  });
};
