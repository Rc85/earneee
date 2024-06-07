import { useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { ProductDiscountsInterface } from '../../../../../_shared/types';
import { setIsLoading } from '../../../redux/app';

export const useCreateProductDiscount = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: ProductDiscountsInterface) =>
      axios({
        method: 'post',
        url: '/v1/auth/admin/product/discount',
        withCredentials: true,
        data: {
          discount: options
        }
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['discounts'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useDeleteProductDiscount = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { id: string }) =>
      axios({
        method: 'delete',
        url: '/v1/auth/admin/product/discount',
        withCredentials: true,
        params: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['discounts'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};
