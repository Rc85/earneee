import axios from 'axios';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../redux/app';

export const authenticate = (application: 'admin' | 'marketplace') => {
  const url = application === 'marketplace' ? '/v1/auth/user' : '/v1/auth/admin';

  return useQuery<{ user: { id: string; email: string; isAdmin: boolean; country: string; status: string } }>(
    {
      queryKey: ['authenticate', application],
      queryFn: async () => {
        const { data } = await axios({ method: 'post', url, withCredentials: true });

        return data;
      }
    }
  );
};

export const useContact = (onSuccess?: (response: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (form: { name: string; email: string; message: string; key: string }) =>
      axios.post('/v1/contact', form),
    onSuccess: (response) => {
      dispatch(setIsLoading(false));

      onSuccess?.(response);
    },
    onError: (err) => {
      onError?.(err);
    }
  });
};

export const useSubscribe = (onSuccess?: (response: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: async (form: { email: string; key: string }) => axios.post('/v1/subscribe', form),
    onSuccess: (response) => {
      dispatch(setIsLoading(false));

      onSuccess?.(response);
    },
    onError: (err) => {
      onError?.(err);
    }
  });
};

export * from './users/mutations';
export * from './affiliates/mutations';
export * from './affiliates/queries';
export * from './categories/mutations';
export * from './categories/queries';
export * from './offers/mutations';
export * from './offers/queries';
export * from './users/queries';
export * from './statuses/queries';
export * from './statuses/mutations';
export * from './products/mutations';
export * from './products/queries';
export * from './products/brands/mutations';
export * from './products/media/mutations';
export * from './products/specifications/mutations';
export * from './products/options/mutations';
export * from './products/brands/queries';
export * from './products/media/queries';
export * from './products/specifications/queries';
export * from './products/options/queries';
export * from './orders/mutations';
export * from './orders/queries';
