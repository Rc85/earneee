import axios from 'axios';
import { useQuery } from 'react-query';

export const authenticate = (application: 'admin' | 'marketplace') => {
  const url = application === 'marketplace' ? '/api/v1/auth/user' : '/api/v1/auth/admin';

  return useQuery<{ data: { user: { id: string; email: string; isAdmin: boolean } } }>(
    ['authenticate', application],
    () => axios({ method: 'post', url, withCredentials: true })
  );
};

export * from './users/mutations';
export * from './affiliates/mutations';
export * from './affiliates/queries';
export * from './categories/mutations';
export * from './categories/queries';
export * from './offers/mutations';
export * from './offers/queries';
export * from './products/queries';
export * from './users/queries';
export * from './products/mutations';
