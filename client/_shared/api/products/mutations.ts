import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../redux/app';
import {
  ProductBrandsInterface,
  ProductOptionsInterface,
  ProductVariantsInterface,
  ProductsInterface
} from '../../../../_shared/types';

export const useCreateProductBrand = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (options: ProductBrandsInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/brand/create',
        withCredentials: true,
        data: options
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['brands']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useDeleteProductBrand = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (brandId: string) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/brand/delete',
        withCredentials: true,
        params: { brandId }
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['brands']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useCreateProduct = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (options: ProductsInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/product/create',
        withCredentials: true,
        data: options
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['products']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useDeleteProduct = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (productId: string) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/product/delete',
        withCredentials: true,
        params: { productId }
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['products']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useCreateProductVariant = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (options: ProductVariantsInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/product/variant/create',
        withCredentials: true,
        data: options
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['variants']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useSortProductVariants = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (options: { variants: ProductVariantsInterface[] }) =>
      axios({
        method: 'put',
        url: '/api/v1/auth/admin/product/variant/sort',
        withCredentials: true,
        data: options
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['variants']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useDeleteProductVariant = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (variantId: string) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/product/variant/delete',
        withCredentials: true,
        params: { variantId }
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['variants']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useDeleteProductOption = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (optionId: string) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/product/option/delete',
        withCredentials: true,
        params: { optionId }
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['options']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useCreateProductOption = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (options: ProductOptionsInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/product/option/create',
        withCredentials: true,
        data: options
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['options']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};
