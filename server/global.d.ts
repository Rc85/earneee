import { PoolClient } from 'pg';

interface ResponseLocals {
  client?: PoolClient;
  response?: { status?: number; data?: Record<K, T> };
  user?: UsersInterace;
}

declare module 'express' {
  export interface Request {
    rawBody?: any;
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
    session: Session & {
      user?: { id: string; email: string };
    };
  }
}

export {};
