import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setIsLoading } from '../../redux/app';
import {
  OrderItemsInterface,
  OrderShipmentsInterface,
  OrdersInterface,
  ProductsInterface
} from '../../../../_shared/types';

export const useAddProduct = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: {
      product: ProductsInterface;
      quantity: number;
      orderId: string;
      country: string;
      orderItemId?: string;
    }) =>
      axios({
        method: 'post',
        url: '/v1/auth/user/cart/item',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['cart'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useRemoveProduct = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { orderItemId?: string; orderId: string | undefined }) =>
      axios({
        method: 'delete',
        url: '/v1/auth/user/cart/item',
        withCredentials: true,
        params: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['cart'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useCheckout = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { orderId: string | undefined; cancelUrl: string }) =>
      axios({
        method: 'post',
        url: '/v1/auth/user/cart/checkout',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['cart'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useUpdateOrder = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { order: OrdersInterface }) =>
      axios({
        method: 'put',
        url: '/v1/auth/admin/order',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['admin orders'] });
      queryClient.invalidateQueries({ queryKey: ['admin order'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useCreateOrderShipment = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { orderShipment: OrderShipmentsInterface }) =>
      axios({
        method: 'post',
        url: '/v1/auth/admin/order/shipment',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['admin order'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useUpdateOrderItem = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { orderItem: OrderItemsInterface }) =>
      axios({
        method: 'put',
        url: '/v1/auth/admin/order/item',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['admin order'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useRefundOrderItem = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { orderItemId: string; quantity: string; reason: string }) =>
      axios({
        method: 'patch',
        url: '/v1/auth/admin/order/item',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['admin order'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useCreateRefund = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { orderItemId: string; quantity: string; reason: string }) =>
      axios({
        method: 'post',
        url: '/v1/auth/user/order/item/refund',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['user order'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useUpdateRefund = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { refundId: string; status: string }) =>
      axios({
        method: 'post',
        url: '/v1/auth/admin/refund',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['admin refunds'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useUpdateRefundNotes = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { refundId: string; notes: string }) =>
      axios({
        method: 'patch',
        url: '/v1/auth/admin/refund',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['admin refunds'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useUploadRefundPhoto = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { refundId: string; photos: string[] }) =>
      axios({
        method: 'post',
        url: '/v1/auth/admin/refund/photo',
        withCredentials: true,
        data: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['admin refunds'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};

export const useDeleteRefundPhoto = (onSuccess?: (data: any) => void, onError?: (err: any) => void) => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (options: { refundId: string; photoId: number }) =>
      axios({
        method: 'delete',
        url: '/v1/auth/admin/refund/photo',
        withCredentials: true,
        params: options
      }),

    onSuccess: (data) => {
      dispatch(setIsLoading(false));

      queryClient.invalidateQueries({ queryKey: ['admin refunds'] });

      onSuccess?.(data);
    },
    onError: (err) => {
      dispatch(setIsLoading(false));

      onError?.(err);
    }
  });
};
