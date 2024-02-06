import dotenv from 'dotenv';

dotenv.config();

import express, { Request, Response } from 'express';
import { createServer } from 'http';
import * as routers from './routers';
import cors from 'cors';
import * as middlewares from './middlewares';

const app = express();
const server = createServer(app);

app.use(
  express.json({
    limit: '96mb',
    verify: function (req: Request, resp: Response, buffer: Buffer) {
      let url = req.originalUrl;

      if (url.startsWith('/webhooks/stripe')) {
        req.rawBody = buffer.toString();
      }
    }
  })
);

app.use(
  cors({
    origin: process.env.ENV === 'development' || ['https://oobooroo.com'],
    credentials: true
  })
);

app.use(
  /^\/api\/v1\/auth\/user.*/,
  middlewares.marketplaceSession,
  middlewares.authenticateMiddleware('user')
);

app.use(/^\/api\/v1\/auth\/admin.*/, middlewares.adminSession, middlewares.authenticateMiddleware('admin'));

app.use(routers.userRouter);
app.use(routers.affiliateRouter);
app.use(routers.categoryRouter);
app.use(routers.offerRouter);
app.use(routers.productRouter);
app.use(routers.productBrandRouter);
app.use(routers.productVariantRouter);

app.use(middlewares.errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

server.on('error', (err) => console.log('Server error', err));
