import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../redux/app';

export const useCreateUser = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (options: {
      email: string;
      password: string;
      confirmPassword: string;
      key: string;
      agreed: boolean;
    }) => axios({ method: 'post', url: '/v1/user', withCredentials: true, data: options }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useUpdateUser = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: {
      id: string;
      status?: string;
      bannedUntil?: string;
      reason?: string;
      isAdmin?: boolean;
      unban?: boolean;
    }) => axios({ method: 'put', url: '/v1/user', withCredentials: true, data: options }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['users'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useLogin = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: {
      email: string;
      password: string;
      remember: boolean;
      application: 'admin' | 'marketplace';
    }) =>
      axios({
        method: 'post',
        url: options.application === 'admin' ? '/v1/auth/admin/login' : '/v1/auth/user/login',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['authenticate'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useLogout = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (application: 'admin' | 'marketplace') =>
      axios({
        method: 'post',
        url: application === 'admin' ? '/v1/auth/admin/logout' : '/v1/auth/user/logout',
        withCredentials: true,
        data: { application }
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['authenticate'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useChangePassword = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: {
      password: string;
      newPassword: string;
      confirmPassword: string;
      admin?: boolean;
    }) =>
      axios({
        method: 'put',
        url: options.admin ? '/v1/auth/admin/password' : '/v1/auth/user/password',
        withCredentials: true,
        data: {
          password: options.password,
          newPassword: options.newPassword,
          confirmPassword: options.confirmPassword
        }
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['authenticate'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useResetPassword = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: (options: { email: string }) =>
      axios({
        method: 'post',
        url: '/v1/password/reset',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};
