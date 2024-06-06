import { NextFunction, Request, Response } from 'express';

export const resetPassword = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;

  // send email

  return next();
};
