import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../redux/app';
import {
  ProductBrandsInterface,
  ProductMediaInterface,
  ProductOptionsInterface,
  ProductSpecificationsInterface,
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

export const useCreateProductSpecification = (
  onSuccess?: (data: any) => void,
  onError?: (err: any) => void
) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (options: ProductSpecificationsInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/product/specification/create',
        withCredentials: true,
        data: options
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['specifications']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useDeleteProductSpecification = (
  onSuccess?: (data: any) => void,
  onError?: (err: any) => void
) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (specificationId: string) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/product/specification/delete',
        withCredentials: true,
        params: { specificationId }
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['specifications']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useSortProductSpecifications = (
  onSuccess?: (data: any) => void,
  onError?: (err: any) => void
) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (options: { specifications: ProductSpecificationsInterface[] }) =>
      axios({
        method: 'put',
        url: '/api/v1/auth/admin/product/specification/sort',
        withCredentials: true,
        data: options
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['specifications']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useUploadProductMedia = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (options: FormData | { variantId: string; image: string }) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/product/media/upload',
        withCredentials: true,
        data: options
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['product media']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useAddProductMedia = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (options: ProductMediaInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/product/media/add',
        withCredentials: true,
        data: options
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['product media']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useSortProductMedia = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (options: { media: ProductMediaInterface[] }) =>
      axios({
        method: 'put',
        url: '/api/v1/auth/admin/product/media/sort',
        withCredentials: true,
        data: options
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['product media']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useUpdateProductMedia = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (options: ProductMediaInterface) =>
      axios({
        method: 'put',
        url: '/api/v1/auth/admin/product/media/update',
        withCredentials: true,
        data: options
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['product media']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useDeleteProductMedia = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (mediaId: string) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/product/media/delete',
        withCredentials: true,
        params: { mediaId }
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['product media']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};
