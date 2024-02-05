import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { HttpException } from '../utils';

export const recaptcha = async (req: Request, resp: Response, next: NextFunction) => {
  const key = req.query.key || req.body.key;
  const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', undefined, {
    params: {
      secret: process.env.INVISIBLE_RECAPTCHA_SECRET,
      response: key
    }
  });

  if (!response.data.success) {
    throw new HttpException(400, 'Recaptcha required');
  }

  return next();
};
