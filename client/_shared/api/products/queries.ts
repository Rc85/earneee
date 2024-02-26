import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  ProductBrandsInterface,
  ProductMediaInterface,
  ProductOptionsInterface,
  ProductSpecificationsInterface,
  ProductVariantsInterface,
  ProductsInterface
} from '../../../../_shared/types';

export const retrieveProducts = (options?: { productId?: string; offset?: number }) => {
  return useQuery<{ products: ProductsInterface[]; count: number }>({
    queryKey: ['products', options?.productId, options?.offset],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/product',
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
        url: '/v1/product/brand',
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
  productId?: string;
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
      options?.productId,
      options?.categoryId,
      options?.subcategoryId,
      options?.groupId
    ],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/product/variant',
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
        url: '/v1/product/option',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveProductSpecifications = (options?: {
  variantId?: string;
  categoryId?: number;
  enabled: boolean;
}) => {
  return useQuery<{ specifications: ProductSpecificationsInterface[] }>({
    enabled: options?.enabled,
    queryKey: ['specifications', options?.variantId, options?.categoryId],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/product/specification',
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
        url: '/v1/product/media',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveMarketplaceProducts = (options?: {
  categoryId?: number;
  offset?: number;
  filters: {
    minPrice: string | undefined;
    maxPrice: string | undefined;
    specifications: {
      [key: string]: ProductSpecificationsInterface;
    };
  };
  orderBy: string;
}) => {
  return useQuery<{ variants: ProductVariantsInterface[]; count: number }>({
    queryKey: [
      'marketplace products',
      options?.categoryId,
      options?.offset,
      options?.filters,
      options?.orderBy
    ],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/auth/marketplace/product',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const searchProducts = (options: { value: string | null; category?: string | null }) => {
  return useQuery<{ variants: ProductVariantsInterface[] }>({
    queryKey: ['search products', options.value, options.category],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/product/search',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};
