import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import { database } from '../../../database';
import bcrypt from 'bcrypt';
import { UsersInterface } from '../../../../../_shared/types';

export const validateCreateUser = (req: Request, _: Response, next: NextFunction) => {
  if (!req.body.email || validations.blankCheck.test(req.body.email)) {
    return next(new HttpException(400, `Email required`));
  } else if (!validations.emailCheck.test(req.body.email)) {
    return next(new HttpException(400, 'Invalid email'));
  } else if (validations.blankCheck.test(req.body.password)) {
    return next(new HttpException(400, 'Password required'));
  } else if (req.body.password.length < 8) {
    return next(new HttpException(400, `Password is too short`));
  } else if (req.body.password !== req.body.confirmPassword) {
    return next(new HttpException(400, `Passwords do not match`));
  } else if (!req.body.agreed) {
    return next(new HttpException(400, `Agreement required`));
  } else if (!validations.countryShortCodeCheck.test(req.body.country)) {
    return next(new HttpException(400, `Invalid country`));
  }

  return next();
};

export const validateLogin = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { email, application, password } = req.body;

  if (!email || validations.blankCheck.test(email)) {
    return next(new HttpException(400, `Email required`));
  }

  const user: UsersInterface[] = await database.retrieve('users', {
    where: 'email = $1',
    params: [email],
    client
  });

  if (user.length === 0) {
    return next(new HttpException(400, `Incorrect password`));
  }

  const match = await bcrypt.compare(password, user[0].password);

  if (!match) {
    return next(new HttpException(400, `Incorrect password`));
  } else if (!['admin', 'marketplace'].includes(application)) {
    return next(new HttpException(400, `Login origin not recognized`));
  }

  resp.locals.user = user[0];

  return next();
};

export const validateChangePassword = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { password, newPassword, confirmPassword } = req.body;

  if (!password || validations.blankCheck.test(password)) {
    return next(new HttpException(400, `Password required`));
  } else if (!newPassword || validations.blankCheck.test(newPassword)) {
    return next(new HttpException(400, `New password required`));
  } else if (newPassword.length < 8) {
    return next(new HttpException(400, `New password is too short`));
  } else if (newPassword !== confirmPassword) {
    return next(new HttpException(400, `Passwords do not match`));
  }

  const user = await database.retrieve('users', { where: 'id = $1', params: [req.session.user?.id], client });

  if (!user.length) {
    return next(new HttpException(400, `Incorrect password`));
  }

  const match = await bcrypt.compare(password, user[0].password);

  if (!match) {
    return next(new HttpException(400, `Incorrect password`));
  }

  return next();
};
