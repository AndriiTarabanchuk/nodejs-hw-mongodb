import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';
import { UPLOAD_DIR } from './constants/index.js';

const PORT = env(env('PORT'), '3000');

export const setupServer = () => {
  console.log(`Server is running on port ${PORT}`);
  const app = express();
  // app.use(
  //   pino({
  //     transport: {
  //       target: 'pino-pretty',
  //     },
  //   }),
  // );
  app.use(cors());

  app.use(cookieParser());

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world.  After authorizations you can get list /contacts ',
    });
  });
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {});
};
