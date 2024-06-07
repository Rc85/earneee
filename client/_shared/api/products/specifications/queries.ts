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
