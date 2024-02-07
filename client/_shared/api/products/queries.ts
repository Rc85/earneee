import axios from 'axios';
import { useQuery } from 'react-query';
import {
  ProductBrandsInterface,
  ProductOptionsInterface,
  ProductVariantsInterface,
  ProductsInterface
} from '../../../../_shared/types';

export const retrieveProducts = (options?: { productId?: string; offset?: number }) => {
  return useQuery<{ data: { products: ProductsInterface[]; count: number } }>(
    ['products', options?.productId, options?.offset],
    () =>
      axios({
        method: 'get',
        url: '/api/v1/product/retrieve',
        params: options,
        withCredentials: true
      })
  );
};

export const retrieveProductBrands = (options?: { brandId: string; offset?: number }) => {
  return useQuery<{ data: { brands: ProductBrandsInterface[]; count: number } }>(
    ['brands', options?.brandId, options?.offset],
    () =>
      axios({
        method: 'get',
        url: '/api/v1/product/brand/retrieve',
        params: options,
        withCredentials: true
      })
  );
};

export const retrieveProductVariants = (options?: { variantId?: string }) => {
  return useQuery<{ data: { variants: ProductVariantsInterface[] } }>(['variants', options?.variantId], () =>
    axios({
      method: 'get',
      url: '/api/v1/product/variant/retrieve',
      params: options,
      withCredentials: true
    })
  );
};

export const retrieveProductOptions = (options?: { variantId?: string }) => {
  return useQuery<{ data: { options: ProductOptionsInterface[] } }>(['options', options?.variantId], () =>
    axios({
      method: 'get',
      url: '/api/v1/product/option/retrieve',
      params: options,
      withCredentials: true
    })
  );
};
