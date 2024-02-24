import session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  database: process.env.SESSION_DB ? parseInt(process.env.SESSION_DB) : 0,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379
  }
});
const redisStore = new RedisStore({ client: redisClient });

if (!redisClient.isReady) {
  redisClient.connect();
}

export const guestSession = session({
  name: `${process.env.APP_NAME}.sid`,
  secret: process.env.GUEST_SESSION_KEY || 'default-guest-session-key',
  cookie: {
    maxAge: 3600000,
    domain: process.env.ENV === 'development' ? undefined : process.env.DOMAIN_NAME!,
    path: '/'
  },
  rolling: true,
  resave: false,
  saveUninitialized: false,
  store: redisStore
});

export const marketplaceSession = session({
  name: `${process.env.APP_NAME}.marketplace.sid`,
  secret: process.env.MARKETPLACE_SESSION_KEY || 'default-marketplace-session-key',
  cookie: {
    maxAge: 3600000,
    domain: process.env.ENV === 'development' ? undefined : process.env.DOMAIN_NAME!,
    path: '/'
  },
  rolling: true,
  resave: false,
  saveUninitialized: false,
  store: redisStore
});

export const adminSession = session({
  name: `${process.env.APP_NAME}.admin.sid`,
  secret: process.env.ADMIN_SESSION_KEY || 'default-admin-session-key',
  cookie: {
    maxAge: 3600000,
    domain: process.env.ENV === 'development' ? undefined : process.env.DOMAIN_NAME!,
    path: '/'
  },
  rolling: true,
  resave: false,
  saveUninitialized: false,
  store: redisStore
});
