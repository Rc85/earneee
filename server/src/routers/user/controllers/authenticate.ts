import { NextFunction, Request, Response } from 'express';

export const authenticate = async (req: Request, resp: Response, next: NextFunction) => {
  if (req.session.user?.id) {
    resp.locals.response = { status: 200, data: { user: req.session.user } };
  }

  return next();
};
