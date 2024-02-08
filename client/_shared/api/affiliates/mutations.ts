import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../redux/app';
import { AffiliatesInterface } from '../../../../_shared/types';

export const useAddAffiliate = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: AffiliatesInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/affiliate/add',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['affiliates'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useDeleteAffiliate = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { affiliateId: string; deleteAllProducts?: boolean }) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/affiliate/delete',
        withCredentials: true,
        params: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['affiliates'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};
