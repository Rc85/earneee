import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ProductsInterface, ProductSpecificationsInterface } from '../../../../_shared/types';

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

export const searchProducts = (options: {
  value: string | null;
  category?: string | null;
  country: string;
}) => {
  return useQuery<{ products: ProductsInterface[] }>({
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

export const retrieveMarketplaceProducts = (options?: {
  categoryId?: number;
  offset?: number;
  featured?: boolean;
  filters?: {
    minPrice: string | undefined;
    maxPrice: string | undefined;
    specifications: {
      [key: string]: ProductSpecificationsInterface[];
    };
  };
  orderBy?: string;
  country: string;
  limit?: number;
}) => {
  return useQuery<{ products: ProductsInterface[]; count: number }>({
    queryKey: [
      'marketplace products',
      options?.categoryId,
      options?.featured,
      options?.offset,
      options?.filters,
      options?.orderBy,
      options?.country,
      options?.limit
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
