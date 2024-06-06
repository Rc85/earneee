import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../utils';

export const authenticateMiddleware = (role: 'user' | 'admin') => {
  return async (req: Request, resp: Response, next: NextFunction) => {
    if (
      (role === 'admin' && (!req.session.user || !req.session.user.isAdmin)) ||
      (role === 'user' && !req.session.user)
    ) {
      return next(new HttpException(401, `Unauthorized`));
    }

    return next();
  };
};
