import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { StatusesInterface } from '../../../../_shared/types';
import { setIsLoading } from '../../redux/app';

export const useCreateStatus = (onSuccess?: (resp: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryclient = useQueryClient();

  return useMutation({
    mutationFn: (options: { status: StatusesInterface }) =>
      axios({
        url: '/api/v1/statuses/create',
        method: 'post',
        data: options,
        withCredentials: true
      }),
    onSuccess: (response: any) => {
      dispatch(setIsLoading(false));

      queryclient.invalidateQueries({ queryKey: ['statuses'] });

      onSuccess?.(response);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};
