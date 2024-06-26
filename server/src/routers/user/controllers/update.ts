import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';
import dayjs from 'dayjs';
import { PasswordResetsInterface, UserBansInterface } from '../../../../../_shared/types';
import bcrypt from 'bcrypt';
import { PoolClient } from 'pg';
import { generateKey } from '../../../../../_shared/utils';
import { sendEmail } from '../../../services';

export const activateAccount = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { key } = req.body;

  await database.update('users', ['status'], {
    where: 'confirmation_key = $2',
    params: ['active', key],
    client
  });

  return next();
};

export const changePassword = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { newPassword } = req.body;

  if (req.session.user?.id) {
    const hashed = await bcrypt.hash(newPassword, 10);

    await database.update('users', ['password'], {
      where: 'id = $2',
      params: [hashed, req.session.user.id],
      client
    });

    await database.update('sessions', ['status'], {
      where: 'id = $2 AND status = $3',
      params: ['terminated', `sess:${req.session.id}`, 'active'],
      client
    });

    req.session.destroy();

    resp.locals.response = { status: 200, data: { statusText: 'Password changed' } };
  }

  return next();
};

export const updateUser = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { id, bannedUntil, reason, status, unban, isAdmin } = req.body;

  if (reason && bannedUntil) {
    await database.create('user_bans', ['user_id', 'banned_until', 'reason'], [id, bannedUntil, reason], {
      client
    });
  } else if (unban) {
    const ban = await database.retrieve<UserBansInterface[]>(`SELECT * FROM user_bans`, {
      where: 'user_id = $1 AND banned_until > NOW()',
      orderBy: 'banned_until DESC',
      limit: '1',
      params: [id],
      client
    });

    if (ban.length) {
      await database.update('user_bans', ['banned_until'], {
        where: `id = $2`,
        params: [dayjs().subtract(1, 'hour').toDate(), ban[0].id],
        client
      });
    }
  }

  if (status || typeof isAdmin === 'boolean') {
    const columns = [];
    const params = [];

    if (status) {
      params.push(status);
      columns.push(`status = $${params.length}`);
    }

    if (typeof isAdmin === 'boolean') {
      params.push(isAdmin);
      columns.push(`is_admin = $${params.length}`);
    }

    params.push(id);

    await database.update('users', columns.join(', '), { where: `id = $${params.length}`, params, client });
  }

  return next();
};

export const resetPassword = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { email } = req.body;

  const token = await generateToken(client);

  await database.update('password_resets', ['expire_at'], {
    where: 'email = $2 AND expire_at > NOW()',
    params: [new Date(), email],
    client
  });

  await database.create('password_resets', ['email', 'token'], [email, token], { client });

  await sendEmail.resetPassword.send(email, token);

  return next();
};

export const updateProfile = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { firstName, lastName, phoneNumber, address, city, region, country, postalCode } = req.body.profile;

  if (req.session.user?.id) {
    await database.update(
      'user_profiles',
      ['first_name', 'last_name', 'phone_number', 'address', 'city', 'region', 'country', 'postal_code'],
      {
        where: 'id = $9',
        params: [
          firstName,
          lastName,
          phoneNumber,
          address,
          city,
          region,
          country,
          postalCode,
          req.session.user.id
        ],
        client
      }
    );
  }

  resp.locals.response = { data: { statusText: 'Profile updated' } };

  return next();
};

export const updateMessage = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { messageId } = req.body;

  if (req.session.user?.id) {
    const params = ['read', req.session.user.id];
    const where = [`user_id = $${params.length}`, `status != 'deleted'`];

    if (messageId) {
      params.push(messageId);

      where.push(`id = $${params.length} `);
    }

    await database.update('user_messages', ['status'], {
      where: where.join(' AND '),
      params,
      client
    });
  }

  return next();
};

export const updatePassword = async (req: Request, resp: Response, next: NextFunction) => {
  const { client, resetPassword } = resp.locals;
  const { token, password } = req.body;

  if (resetPassword) {
    const encrypted = await bcrypt.hash(password, 10);

    await database.update('users', ['password'], {
      where: 'email = $2',
      params: [encrypted, resetPassword.email],
      client
    });

    await database.update('password_resets', ['expire_at'], {
      where: 'token = $2',
      params: [new Date(), token],
      client
    });
  }

  return next();
};

const generateToken = async (client?: PoolClient): Promise<string> => {
  const token = generateKey(1, 12);

  const exists = await database.retrieve<PasswordResetsInterface[]>(`SELECT * FROM password_resets`, {
    where: 'token = $1',
    params: [token],
    client
  });

  if (exists.length) {
    return await generateToken(client);
  }

  return token;
};
