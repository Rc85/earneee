import { PoolClient } from 'pg';
import {
  OrderItemsInterface,
  OrdersInterface,
  PasswordResetsInterface,
  RefundsInterface
} from '../_shared/types';
import Stripe from 'stripe';

interface ResponseLocals {
  client?: PoolClient;
  response?: { status?: number; data?: Record<K, T> };
  user?: UsersInterace;
  order?: OrdersInterface;
  orderItem?: OrderItemsInterface;
  lineItem?: Stripe.LineItem;
  refund?: RefundsInterface;
  resetPassword?: PasswordResetsInterface;
}

declare module 'express' {
  export interface Request {
    rawBody?: any;
    files: any;
    session: Session & {
      user?: { id: string; email: string };
    };
  }

  export interface Response {
    locals: ResponseLocals;
  }
}

declare module 'http' {
  interface IncomingMessage {
    rawBody?: any;
    files: any;
    session: Session & {
      user?: { id: string; email: string };
    };
  }
}

export {};
