import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../redux/app';
import { OffersInterface } from '../../../../_shared/types';

export const useCreateOffer = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: OffersInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/offer/create',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['offers'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useDeleteOffer = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (offerId: string) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/offer/delete',
        withCredentials: true,
        params: { offerId }
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['offers'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useSortOffers = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { offers: OffersInterface[] }) =>
      axios({
        method: 'put',
        url: '/api/v1/auth/admin/offer/sort',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['offers'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};
