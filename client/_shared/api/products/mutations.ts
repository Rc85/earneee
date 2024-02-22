import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../redux/app';
import {
  ProductBrandsInterface,
  ProductMediaInterface,
  ProductOptionsInterface,
  ProductSpecificationsInterface,
  ProductUrlsInterface,
  ProductVariantsInterface,
  ProductsInterface
} from '../../../../_shared/types';

export const useCreateProductBrand = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: ProductBrandsInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/brand',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['brands'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useDeleteProductBrand = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (brandId: string) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/brand',
        withCredentials: true,
        params: { brandId }
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['brands'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useCreateProduct = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: ProductsInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/product',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['products'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useDeleteProduct = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/product',
        withCredentials: true,
        params: { productId }
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['products'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useCreateProductVariant = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: ProductVariantsInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/product/variant',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['variants'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useSortProductVariants = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { variants: ProductVariantsInterface[] }) =>
      axios({
        method: 'put',
        url: '/api/v1/auth/admin/product/variant',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['variants'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useDeleteProductVariant = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variantId: string) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/product/variant',
        withCredentials: true,
        params: { variantId }
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['variants'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useDeleteProductOption = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (optionId: string) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/product/option',
        withCredentials: true,
        params: { optionId }
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['options'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useCreateProductOption = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: ProductOptionsInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/product/option',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['options'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useCreateProductSpecification = (
  onSuccess?: (data: any) => void,
  onError?: (err: any) => void
) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: ProductSpecificationsInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/product/specification',
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
        url: '/api/v1/auth/admin/product/specification',
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
        url: '/api/v1/auth/admin/product/specification',
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

export const useUploadProductMedia = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: FormData | { variantId: string; image: string }) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/product/media/upload',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['product media'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useAddProductMedia = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: ProductMediaInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/product/media/add',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['product media'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useSortProductMedia = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { media: ProductMediaInterface[] }) =>
      axios({
        method: 'put',
        url: '/api/v1/auth/admin/product/media',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['product media'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useUpdateProductMedia = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: ProductMediaInterface) =>
      axios({
        method: 'put',
        url: '/api/v1/auth/admin/product/media',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['product media'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useCreateProductUrl = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: ProductUrlsInterface) =>
      axios({
        method: 'post',
        url: '/api/v1/auth/admin/product/url',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['product url'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useDeleteProductMedia = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (mediaId: string) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/product/media',
        withCredentials: true,
        params: { mediaId }
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['product media'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useDeleteProductUrl = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (urlId: string) =>
      axios({
        method: 'delete',
        url: '/api/v1/auth/admin/product/url',
        withCredentials: true,
        params: { urlId }
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['product url'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};
