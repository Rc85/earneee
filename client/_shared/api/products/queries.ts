import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  ProductBrandsInterface,
  ProductMediaInterface,
  ProductOptionsInterface,
  ProductSpecificationsInterface,
  ProductUrlsInterface,
  ProductVariantsInterface,
  ProductsInterface
} from '../../../../_shared/types';

export const retrieveProducts = (options?: { productId?: string; offset?: number }) => {
  return useQuery<{ products: ProductsInterface[]; count: number }>({
    queryKey: ['products', options?.productId, options?.offset],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/api/v1/product/retrieve',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveProductBrands = (options?: { brandId: string; offset?: number }) => {
  return useQuery<{ brands: ProductBrandsInterface[]; count: number }>({
    queryKey: ['brands', options?.brandId, options?.offset],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/api/v1/product/brand/retrieve',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveProductVariants = (options?: {
  variantId?: string;
  featured?: boolean;
  type?: 'new' | 'popular';
  categoryId?: number;
  subcategoryId?: number;
  groupId?: number;
}) => {
  return useQuery<{ variants: ProductVariantsInterface[] }>({
    queryKey: [
      'variants',
      options?.variantId,
      options?.featured,
      options?.type,
      options?.categoryId,
      options?.subcategoryId,
      options?.groupId
    ],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/api/v1/product/variant/retrieve',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveProductOptions = (options?: { variantId?: string }) => {
  return useQuery<{ options: ProductOptionsInterface[] }>({
    queryKey: ['options', options?.variantId],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/api/v1/product/option/retrieve',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveProductSpecifications = (options?: { variantId?: string }) => {
  return useQuery<{ specifications: ProductSpecificationsInterface[] }>({
    queryKey: ['specifications', options?.variantId],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/api/v1/product/specification/retrieve',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveProductMedia = (options?: { variantId?: string }) => {
  return useQuery<{ media: ProductMediaInterface[] }>({
    queryKey: ['product media', options?.variantId],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/api/v1/product/media/retrieve',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveMarketplaceProducts = (options?: { categoryId?: number; offset?: number }) => {
  return useQuery<{ variants: ProductVariantsInterface[]; count: number }>({
    queryKey: ['marketplace products', options?.categoryId, options?.offset],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/api/v1/auth/marketplace/product/retrieve',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveProductUrls = (options?: { variantId?: string }) => {
  return useQuery<{ urls: ProductUrlsInterface[] }>({
    queryKey: ['product url', options?.variantId],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/api/v1/product/url/retrieve',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};
