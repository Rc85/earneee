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
