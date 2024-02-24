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
    origin: process.env.ENV === 'development' || [process.env.SITE_URL!],
    credentials: true
  })
);

app.use(/.*/, (req, resp, next) => {
  if (process.env.ENV === 'development') {
    // we don't need to check for subdomain in development

    return next();
  }

  const hostChunks = req.headers.host?.split('.') || [];
  const subdomain = hostChunks[0];

  if (['admin', 'staging-admin'].includes(subdomain)) {
    return resp.sendFile(path.resolve('web/admin/index.html'));
  } else if (subdomain === 'api') {
    return next();
  }
});

app.use(/^\/v1\/auth\/(marketplace|user)/, middlewares.marketplaceSession);

app.use(/^\/v1\/auth\/user\/(?!login).*/, middlewares.authenticateMiddleware('user'));

app.use(/^\/v1\/auth\/admin.*/, middlewares.adminSession, middlewares.authenticateMiddleware('admin'));

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
app.use(routers.productUrlRouter);
app.use(routers.statusRouter);

app.use(middlewares.errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

server.on('error', (err) => console.log('Server error', err));
