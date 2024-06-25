import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { database } from '../../../middlewares';
import { sendEmail } from '../../../services';
import { generateKey } from '../../../../../_shared/utils';
import { PoolClient } from 'pg';
import { RefundsInterface } from '../../../../../_shared/types';

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

export const contact = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { name, email, message } = req.body;

  await database.create('feedback', ['name', 'email', 'message'], [name, email, message], { client });

  resp.locals.response = { data: { statusText: 'Message received' } };

  return next();
};

export const subscribe = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const { email } = req.body;

  await database.create('subscribers', ['email'], [email], {
    conflict: { columns: 'email', do: `NOTHING` },
    client
  });

  resp.locals.response = { data: { statusText: 'Thank you for subscribing' } };

  return next();
};

export const createRefund = async (req: Request, resp: Response, next: NextFunction) => {
  const { client, lineItem } = resp.locals;
  const { orderItemId, quantity, reason } = req.body;
  const id = generateKey(1);

  if (lineItem) {
    const itemPrice = lineItem?.price?.unit_amount || 0;
    const itemTax = (lineItem?.amount_tax || 0) / (lineItem?.quantity || 1);
    const amount = (itemPrice + itemTax) / 100;
    const number = await generateRefundNumber(client);

    await database.create(
      'refunds',
      ['id', 'order_item_id', 'amount', 'quantity', 'reason', 'status', 'number'],
      [id, orderItemId, amount, quantity, reason, 'pending', number],
      { client }
    );

    resp.locals.response = { data: { statusText: 'Refund requested' } };
  }

  return next();
};

const generateRefundNumber = async (client?: PoolClient): Promise<string> => {
  const number = generateKey(1, 8).toUpperCase();

  const exists = await database.retrieve<RefundsInterface[]>(`SELECT * FROM refunds`, {
    where: 'number = $1',
    params: [number],
    client
  });

  if (exists.length) {
    return await generateRefundNumber(client);
  }

  return number;
};
