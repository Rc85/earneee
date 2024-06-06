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

export const retrieveProducts = (options?: {
  id?: string;
  parentId?: string;
  productId?: string;
  offset?: number;
}) => {
  return useQuery<{ products: ProductsInterface[]; count: number }>({
    queryKey: ['products', options?.id, options?.parentId, options?.productId, options?.offset],
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

export const retrieveProductShowcase = (options?: { type: string; country: string }) => {
  return useQuery<{ products: ProductsInterface[]; count: number }>({
    queryKey: ['product showcase', options?.type, options?.country],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/product/showcase',
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
  country?: string;
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
      options?.groupId,
      options?.country
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

export const retrieveProductOptions = (options?: { productId?: string; variantId?: string }) => {
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
  productId?: string;
  categoryId?: number;
  enabled: boolean;
}) => {
  return useQuery<{ specifications: ProductSpecificationsInterface[] }>({
    enabled: options?.enabled,
    queryKey: ['specifications', options?.productId, options?.categoryId],
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

export const retrieveMarketplaceProductSpecifications = (options?: {
  categoryId?: number;
  enabled: boolean;
}) => {
  return useQuery<{ specifications: ProductSpecificationsInterface[] }>({
    enabled: options?.enabled,
    queryKey: ['marketplace specifications', options?.categoryId],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/marketplace/product/specification',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveProductMedia = (options?: { variantId?: string; productId?: string }) => {
  return useQuery<{ media: ProductMediaInterface[] }>({
    queryKey: ['product media', options?.productId, options?.variantId],
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
      [key: string]: ProductSpecificationsInterface[];
    };
  };
  orderBy: string;
  country: string;
}) => {
  return useQuery<{ variants: ProductVariantsInterface[]; count: number }>({
    queryKey: [
      'marketplace products',
      options?.categoryId,
      options?.offset,
      options?.filters,
      options?.orderBy,
      options?.country
    ],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/auth/marketplace/products',
        params: options,
        withCredentials: true
      });

      return data;
    },
    staleTime: 30000
  });
};

export const retrieveMarketplaceProduct = (options?: { productId: string; country: string }) => {
  return useQuery<{ product: ProductsInterface }>({
    queryKey: ['marketplace product', options?.productId, options?.country],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/auth/marketplace/product',
        params: options,
        withCredentials: true
      });

      return data;
    },
    staleTime: 30000
  });
};

export const retrieveMarketplaceVariants = (options?: {
  featured?: boolean;
  limit?: number;
  country: string;
}) => {
  return useQuery<{ variants: ProductVariantsInterface[] }>({
    queryKey: ['marketplace variants', options?.featured, options?.limit, options?.country],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/auth/marketplace/variants',
        params: options,
        withCredentials: true
      });

      return data;
    },
    staleTime: 15000
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
