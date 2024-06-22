import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { FaqsInterface } from '../../../../_shared/types';
import { setIsLoading } from '../../redux/app';

export const useCreateQuestion = (onSuccess?: (response: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (form: FaqsInterface) =>
      axios({ method: 'post', url: '/v1/auth/admin/faq', data: form, withCredentials: true }),
    onSuccess: (response) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['faqs'] });

      onSuccess?.(response);
    },
    onError: (err) => {
      onError?.(err);
    }
  });
};

export const useDeleteQuestion = (onSuccess?: (response: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (options: { questionId: string }) =>
      axios({ method: 'delete', url: '/v1/auth/admin/faq', params: options, withCredentials: true }),
    onSuccess: (response) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['faqs'] });

      onSuccess?.(response);
    },
    onError: (err) => {
      onError?.(err);
    }
  });
};
