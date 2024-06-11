import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { database } from '../../../middlewares';
import { sendEmail } from '../../../services';

export const createUser = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { email, password, country } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await database.create('users', ['email', 'password'], [email, hashed], {
    conflict: { columns: 'email', do: 'UPDATE SET updated_at = now()' },
    client
  });

  if (user.length === 1 && country) {
    await database.create('user_profiles', ['id', 'country'], [user[0].id, country], { client });

    await sendEmail.newAccount.send(req.body.email, user[0].confirmationKey);
  }

  resp.locals.response = { status: 201, data: { statusText: 'Account created' } };

  return next();
};
