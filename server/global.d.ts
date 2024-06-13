import { PoolClient } from 'pg';
import { OrdersInterface } from '../_shared/types';

interface ResponseLocals {
  client?: PoolClient;
  response?: { status?: number; data?: Record<K, T> };
  user?: UsersInterace;
  order?: OrdersInterface;
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
