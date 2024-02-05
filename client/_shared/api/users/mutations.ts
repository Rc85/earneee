import axios from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../redux/app';

export const useCreateUser = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();

  return useMutation(
    (options: { email: string; password: string; confirmPassword: string; key: string; agreed: boolean }) =>
      axios({ method: 'post', url: '/api/v1/user/create', withCredentials: true, data: options }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useLogin = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (options: { email: string; password: string; remember: boolean; application: 'admin' | 'marketplace' }) =>
      axios({
        method: 'post',
        url: options.application === 'admin' ? '/api/v1/auth/admin/login' : '/api/v1/auth/user/login',
        withCredentials: true,
        data: options
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['authenticate']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useLogout = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (application: 'admin' | 'marketplace') =>
      axios({
        method: 'post',
        url: application === 'admin' ? '/api/v1/auth/admin/logout' : '/api/v1/auth/user/logout',
        withCredentials: true,
        data: { application }
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['authenticate']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};

export const useChangePassword = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation(
    (options: { password: string; newPassword: string; confirmPassword: string; admin?: boolean }) =>
      axios({
        method: 'post',
        url: options.admin ? '/api/v1/auth/admin/password/change' : '/api/v1/auth/user/password/change',
        withCredentials: true,
        data: {
          password: options.password,
          newPassword: options.newPassword,
          confirmPassword: options.confirmPassword
        }
      }),
    {
      onSuccess: (data) => {
        dispatch(setIsLoading(false));

        queryClient.invalidateQueries(['authenticate']);

        onSuccess?.(data);
      },
      onError: (err) => {
        dispatch(setIsLoading(false));

        onError?.(err);
      }
    }
  );
};
