import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';
import cookieParser from 'cookie-parser';
import router from './routes/index.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import errorHandler from './middlewares/errorHandler.js';

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
      message:
        'Hello world. You can get list /contacts or /contacts/:contactId ',
    });
  });

  app.use(router);

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {});
};
