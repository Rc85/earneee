import { NextFunction, Request, Response } from 'express';
import { HttpException, validations } from '../../../utils';
import { database } from '../../../middlewares';
import bcrypt from 'bcrypt';
import { UserBansInterface, UsersInterface } from '../../../../../_shared/types';
import dayjs from 'dayjs';
import { parsePhoneNumber } from 'awesome-phonenumber';

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

  const user: UsersInterface[] = await database.retrieve<UsersInterface[]>('SELECT * FROM users', {
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

  const ban = await database.retrieve<UserBansInterface[]>('SELECT * FROM user_bans', {
    where: 'user_id = $1 AND banned_until > NOW()',
    params: [user[0].id],
    client
  });

  if (ban.length) {
    if (ban[0].bannedUntil) {
      return next(new HttpException(400, `This account has been temporarily suspended`));
    } else {
      return next(new HttpException(400, `This account has been permanently banned`));
    }
  }

  resp.locals.user = user[0];

  return next();
};

export const validateActivateAccount = async (req: Request, resp: Response, next: NextFunction) => {
  const { key } = req.body;
  const { client } = resp.locals;

  if (!key || validations.blankCheck.test(key)) {
    return next(new HttpException(400, `Confirmation key required`));
  } else if (!validations.uuidCheck.test(key)) {
    return next(new HttpException(400, `Invalid confirmation key`));
  }

  const user = await database.retrieve<UsersInterface[]>('SELECT * FROM users', {
    where: 'confirmation_key = $1',
    params: [key],
    client
  });

  if (!user.length) {
    return next(new HttpException(400, `Invalid confirmation key`));
  } else if (dayjs().diff(dayjs(user[0].createdAt), 'hours') > 24) {
    return next(new HttpException(400, `Please login to your account again`));
  } else if (user[0].status === 'active') {
    return next(new HttpException(400, `Account already activated`));
  }

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

  const user = await database.retrieve<UsersInterface[]>('SELECT password FROM users', {
    where: 'id = $1',
    params: [req.session.user?.id],
    client
  });

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

export const validateUpdateProfile = (req: Request, _: Response, next: NextFunction) => {
  if (!req.body.profile) {
    return next(new HttpException(400, `Profile required`));
  }

  const { firstName, lastName, phoneNumber, address, city, region, country, postalCode } = req.body.profile;

  if (firstName && (typeof firstName !== 'string' || !validations.nameCheck.test(firstName))) {
    return next(new HttpException(400, `Invalid first name`));
  } else if (lastName && (typeof lastName !== 'string' || !validations.nameCheck.test(lastName))) {
    return next(new HttpException(400, `Invalid last name`));
  } else if (address && typeof address !== 'string') {
    return next(new HttpException(400, `Invalid address`));
  } else if (city && typeof city !== 'string') {
    return next(new HttpException(400, `Invalid city`));
  } else if (region && (typeof region !== 'string' || !validations.regionShortCodeCheck.test(region))) {
    return next(new HttpException(400, `Invalid state/province`));
  } else if (country && (typeof country !== 'string' || !validations.countryShortCodeCheck.test(country))) {
    return next(new HttpException(400, `Invalid country`));
  } else if (postalCode && typeof postalCode !== 'string') {
    return next(new HttpException(400, `Invalid postal/zip code`));
  }

  if (phoneNumber) {
    const pn = parsePhoneNumber(phoneNumber, { regionCode: country });

    if (!pn.valid) {
      return next(new HttpException(400, `Invalid phone number`));
    }

    req.body.profile.phoneNumber = pn.number.e164;
  }

  return next();
};
