import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { ProductSpecificationsInterface } from '../../../../../_shared/types';

export const retrieveProductSpecifications = (options?: {
  productId?: string;
  categoryId?: number;
  enabled: boolean;
}) => {
  return useQuery<{ specifications: ProductSpecificationsInterface[] }>({
    enabled: options?.enabled,
    queryKey: ['product specifications', options?.productId, options?.categoryId],
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

export const retrieveSpecifications = (options?: { name?: string }) => {
  return useQuery<{ specifications: ProductSpecificationsInterface[] }>({
    enabled: Boolean(options?.name),
    queryKey: ['specifications', options?.name],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/specifications',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};

export const retrieveMarketplaceProductSpecifications = (options?: {
  categoryId?: string;
  enabled: boolean;
}) => {
  return useQuery<{ specifications: ProductSpecificationsInterface[] }>({
    enabled: options?.enabled,
    queryKey: ['marketplace specifications', options?.categoryId],
    queryFn: async () => {
      const { data } = await axios({
        method: 'get',
        url: '/v1/marketplace/product/specifications',
        params: options,
        withCredentials: true
      });

      return data;
    }
  });
};
