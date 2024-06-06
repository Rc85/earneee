import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../utils';
import { db } from '../../src/middlewares/database';

export const middleware = (controller: any) => {
  return async (req: Request, resp: Response, next: NextFunction) => {
    const { client } = resp.locals;

    try {
      return await controller(req, resp, next);
    } catch (e: any) {
      console.log(e);

      if (client) {
        await client.query('ROLLBACK');
      }

      return next(new HttpException(e.status || 500, e.message));
    }
  };
};

export const dbConnect = async (_: Request, resp: Response, next: NextFunction) => {
  try {
    const client = await db.connect();

    try {
      await client.query('BEGIN');

      resp.locals.client = client;

      return next();
    } catch (e: any) {
      await client.query('ROLLBACK');

      return next(new HttpException(500, e.message));
    }
  } catch (e: any) {
    console.log('Database connection error', e);

    return next(new HttpException(500, e.message));
  }
};

export const response = async (_: Request, resp: Response) => {
  const { client } = resp.locals;

  if (client) {
    await client.query('COMMIT');

    await client.release();
  }

  return resp.status(resp.locals.response?.status || 200).send(resp.locals.response?.data);
};

export const errorHandler = async (err: HttpException, req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;

  console.log('Error', err);

  if (client) {
    await client.query('ROLLBACK');

    await client.release();
  }

  const message = err.origin === `${process.env.APP_NAME}-error` ? err.message : 'An error occurred';

  return resp.status(err.status).send({ statusText: message });
};

export const initGuestSession = (req: Request, _: Response, next: NextFunction) => {
  if (!req.session.user) {
    req.session.user = {};
  }

  console.log('guest');

  return next();
};

export { guestSession, marketplaceSession, adminSession } from './sessions';
export { recaptcha } from './recaptcha';
export { validateCreateUser } from '../routers/user/controllers/validate';
export { authenticateMiddleware } from './authenticate';
export { database } from '../../src/middlewares/database';
