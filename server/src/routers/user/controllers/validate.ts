import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import { database } from '../../../database';
import bcrypt from 'bcrypt';
import { UsersInterface } from '../../../../../_shared/types';
import dayjs from 'dayjs';

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

  if (user.length === 0 || user[0].status === 'terminated') {
    return next(new HttpException(400, `Incorrect password`));
  } else if (user[0].status === 'inactive') {
    return next(new HttpException(400, `Please activate your account`));
  } else if (user[0].status === 'suspended') {
    return next(new HttpException(400, `Your account has been suspended`));
  }

  const match = await bcrypt.compare(password, user[0].password);

  if (!match) {
    return next(new HttpException(400, `Incorrect password`));
  } else if (!['admin', 'marketplace'].includes(application)) {
    return next(new HttpException(400, `Login origin not recognized`));
  }

  const ban = await database.retrieve('user_bans', {
    where: 'user_id = $1 AND banned_until > NOW()',
    params: [user[0].id],
    client
  });

  if (ban.length) {
    return next(new HttpException(400, `Account is banned`));
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

export const validateContact = (req: Request, _: Response, next: NextFunction) => {
  const { name, email, message } = req.body;

  if (!name || validations.blankCheck.test(name)) {
    return next(new HttpException(400, `Name required`));
  } else if (!email || validations.blankCheck.test(email)) {
    return next(new HttpException(400, `Email required`));
  } else if (!validations.emailCheck.test(email)) {
    return next(new HttpException(400, 'Invalid email'));
  } else if (!message || validations.blankCheck.test(message)) {
    return next(new HttpException(400, `Message required`));
  } else if (message.length > 5000) {
    return next(new HttpException(400, `Message is too long`));
  }

  return next();
};

export const validateUpdateUser = (req: Request, _: Response, next: NextFunction) => {
  if (req.body.bannedUntil && !dayjs(req.body.bannedUntil).isValid()) {
    return next(new HttpException(400, `Invalid date`));
  } else if (req.body.reason && req.body.reason.length > 1000) {
    return next(new HttpException(400, `Reason is too long`));
  } else if (req.body.status && !['active', 'terminated', 'suspended'].includes(req.body.status)) {
    return next(new HttpException(400, `Invalid status`));
  }

  return next();
};

export const validateSubscribe = (req: Request, _: Response, next: NextFunction) => {
  if (!req.body.email || validations.blankCheck.test(req.body.email)) {
    return next(new HttpException(400, `Email required`));
  } else if (!validations.emailCheck.test(req.body.email)) {
    return next(new HttpException(400, 'Invalid email'));
  }

  return next();
};
