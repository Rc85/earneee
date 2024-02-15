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
  return useQuery<{ data: { products: ProductsInterface[]; count: number } }>({
    queryKey: ['products', options?.productId, options?.offset],
    queryFn: () =>
      axios({
        method: 'get',
        url: '/api/v1/product/retrieve',
        params: options,
        withCredentials: true
      })
  });
};

export const retrieveProductBrands = (options?: { brandId: string; offset?: number }) => {
  return useQuery<{ data: { brands: ProductBrandsInterface[]; count: number } }>({
    queryKey: ['brands', options?.brandId, options?.offset],
    queryFn: () =>
      axios({
        method: 'get',
        url: '/api/v1/product/brand/retrieve',
        params: options,
        withCredentials: true
      })
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
  return useQuery<{ data: { variants: ProductVariantsInterface[] } }>({
    queryKey: [
      'variants',
      options?.variantId,
      options?.featured,
      options?.type,
      options?.categoryId,
      options?.subcategoryId,
      options?.groupId
    ],
    queryFn: () =>
      axios({
        method: 'get',
        url: '/api/v1/product/variant/retrieve',
        params: options,
        withCredentials: true
      })
  });
};

export const retrieveProductOptions = (options?: { variantId?: string }) => {
  return useQuery<{ data: { options: ProductOptionsInterface[] } }>({
    queryKey: ['options', options?.variantId],
    queryFn: () =>
      axios({
        method: 'get',
        url: '/api/v1/product/option/retrieve',
        params: options,
        withCredentials: true
      })
  });
};

export const retrieveProductSpecifications = (options?: { variantId?: string }) => {
  return useQuery<{ data: { specifications: ProductSpecificationsInterface[] } }>({
    queryKey: ['specifications', options?.variantId],
    queryFn: () =>
      axios({
        method: 'get',
        url: '/api/v1/product/specification/retrieve',
        params: options,
        withCredentials: true
      })
  });
};

export const retrieveProductMedia = (options?: { variantId?: string }) => {
  return useQuery<{ data: { media: ProductMediaInterface[] } }>({
    queryKey: ['product media', options?.variantId],
    queryFn: () =>
      axios({
        method: 'get',
        url: '/api/v1/product/media/retrieve',
        params: options,
        withCredentials: true
      })
  });
};

export const retrieveMarketplaceProducts = (options?: { categoryId?: number; offset?: number }) => {
  return useQuery<{ data: { variants: ProductVariantsInterface[]; count: number } }>({
    queryKey: ['marketplace products', options?.categoryId, options?.offset],
    queryFn: () =>
      axios({
        method: 'get',
        url: '/api/v1/auth/marketplace/product/retrieve',
        params: options,
        withCredentials: true
      })
  });
};

export const retrieveProductUrls = (options?: { variantId?: string }) => {
  return useQuery<{ data: { urls: ProductUrlsInterface[] } }>({
    queryKey: ['product url', options?.variantId],
    queryFn: () =>
      axios({
        method: 'get',
        url: '/api/v1/product/url/retrieve',
        params: options,
        withCredentials: true
      })
  });
};
