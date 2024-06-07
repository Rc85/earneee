import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../../redux/app';
import { ProductSpecificationsInterface } from '../../../../../_shared/types';

export const useCreateProductSpecification = (
  onSuccess?: (data: any) => void,
  onError?: (err: any) => void
) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: ProductSpecificationsInterface[]) =>
      axios({
        method: 'post',
        url: '/v1/auth/admin/product/specification',
        withCredentials: true,
        data: {
          specifications: options
        }
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['specifications'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useUpdateProductSpecification = (
  onSuccess?: (data: any) => void,
  onError?: (err: any) => void
) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: ProductSpecificationsInterface) =>
      axios({
        method: 'patch',
        url: '/v1/auth/admin/product/specification',
        withCredentials: true,
        data: {
          specification: options
        }
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['specifications'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useDeleteProductSpecification = (
  onSuccess?: (data: any) => void,
  onError?: (err: any) => void
) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (specificationId: string) =>
      axios({
        method: 'delete',
        url: '/v1/auth/admin/product/specification',
        withCredentials: true,
        params: { specificationId }
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['specifications'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useSortProductSpecifications = (
  onSuccess?: (data: any) => void,
  onError?: (err: any) => void
) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { specifications: ProductSpecificationsInterface[] }) =>
      axios({
        method: 'put',
        url: '/v1/auth/admin/product/specification',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['specifications'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};
