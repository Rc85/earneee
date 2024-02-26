import dotenv from 'dotenv';

dotenv.config();

import express from 'express';
import { createServer } from 'http';
import * as routers from './routers';
import cors from 'cors';
import * as middlewares from './middlewares';
import path from 'path';

const app = express();
const server = createServer(app);

app.use(
  express.json({
    limit: '96mb'
    /* verify: function (req: Request, resp: Response, buffer: Buffer) {
      let url = req.originalUrl;

      if (url.startsWith('/webhooks/stripe')) {
        req.rawBody = buffer.toString();
      }
    } */
  })
);

app.use(
  cors({
    origin: process.env.ENV === 'development' || [
      `https://${process.env.APP_NAME}.com`,
      `https://api.${process.env.APP_NAME}.com`,
      `https://admin.${process.env.APP_NAME}.com`,
      `https://www.${process.env.APP_NAME}.com`
    ],
    credentials: true
  })
);

app.use('/assets', (req, resp, next) => {
  const hostChunks = req.headers.host?.split('.') || [];
  const subdomain = hostChunks[0];

  if (['admin'].includes(subdomain)) {
    return express.static(path.resolve('client/admin/dist/assets'))(req, resp, next);
  }

  return next();
});

app.use('/favicon.ico', (req, resp, next) => {
  const hostChunks = req.headers.host?.split('.') || [];
  const subdomain = hostChunks[0];

  if (!subdomain || ['www'].includes(subdomain)) {
    return express.static(path.resolve('client/marketplace/favicon.ico'))(req, resp, next);
  } else if (['admin'].includes(subdomain)) {
    return express.static(path.resolve('client/admin/dist/favicon.ico'))(req, resp, next);
  }

  return next();
});

app.use(/(?!(\/assets|favicon.ico)).*/, (req, resp, next) => {
  if (process.env.ENV === 'development') {
    // we don't need to check for subdomain in development

    return next();
  }

  const hostChunks = req.headers.host?.split('.') || [];
  const subdomain = hostChunks[0];

  if (['admin', 'staging-admin'].includes(subdomain)) {
    return resp.sendFile(path.resolve('client/admin/dist/index.html'));
  } else if (subdomain === 'api') {
    return next();
  }
});

app.use(/^\/v1\/auth\/(marketplace|user)/, middlewares.marketplaceSession);

app.use(/^\/v1\/auth\/user\/(?!login).*/, middlewares.authenticateMiddleware('user'));

app.use(/^\/v1\/auth\/admin/, middlewares.adminSession);

app.use(/^\/v1\/auth\/admin\/(?!login).*/, middlewares.authenticateMiddleware('admin'));

app.use(routers.userRouter);
app.use(routers.affiliateRouter);
app.use(routers.categoryRouter);
app.use(routers.offerRouter);
app.use(routers.productRouter);
app.use(routers.productBrandRouter);
app.use(routers.productVariantRouter);
app.use(routers.productOptionRouter);
app.use(routers.productSpecificationRouter);
app.use(routers.productMediaRouter);
app.use(routers.statusRouter);

app.use(middlewares.errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

server.on('error', (err) => console.log('Server error', err));
