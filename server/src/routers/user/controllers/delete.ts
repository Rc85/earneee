import { NextFunction, Request, Response } from 'express';
import { database } from '../../../middlewares';

export const deleteMessages = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;
  const messageIds = req.query.messageIds as string[];

  if (req.session.user?.id) {
    await database.update('user_messages', ['status'], {
      where: 'id = ANY($2) AND user_id = $3',
      params: ['deleted', messageIds, req.session.user.id],
      client
    });

    resp.locals.response = { data: { statusText: `Message${messageIds.length > 1 ? 's' : ''} deleted` } };
  }

  return next();
};

export const deleteAccount = async (req: Request, resp: Response, next: NextFunction) => {
  const { client } = resp.locals;

  if (req.session.user?.id) {
    await database.update('users', ['status'], {
      where: 'id = $2',
      params: ['deleted', req.session.user.id],
      client
    });

    await database.update('sessions', ['status'], {
      where: 'user_id = $2 AND status = $3',
      params: ['terminated', req.session.user.id, 'active'],
      client
    });

    req.session.destroy();

    resp.locals.response = { data: { statusText: 'Account deleted' } };
  }

  return next();
};

export const cancelRefund = async (req: Request, resp: Response, next: NextFunction) => {
  const { client, refund } = resp.locals;

  if (refund) {
    await database.delete('refunds', { where: 'id = $1', params: [refund.id], client });

    resp.locals.response = { data: { statusText: 'Refund canceled' } };
  }

  return next();
};
