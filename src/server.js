import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { env } from './utils/env.js';

import {
  notFoundMiddleware,
  errorHandlerMiddleware,
} from './middlewares/index.js';

import { contactService } from './services/index.js';
const PORT = env(env('PORT'), '3000');

export const setupServer = () => {
  console.log(`Server is running on port ${PORT}`);
  const app = express();

  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use(cors());

  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      message:
        'Hello world. You can get list /contacts or /contacts/:contactId ',
    });
  });

  app.get('/contacts', async (req, res) => {
    try {
      const contacts = await contactService.getAllContacts();
      res.status(200).json({
        status: 200,
        message: 'Successfully found contacts!',
        data: contacts,
      });
    } catch (error) {
      console.log('Error in get data /contacts', error);
    }
  });

  app.get('/contacts/:contactId', async (req, res) => {
    try {
      const { contactId } = req.params;
      const contact = await contactService.getContactById(contactId);
      if (!contact) {
        res.status(404).json({
          message: 'Contact not found',
        });
        return;
      }
      res.status(200).json({
        status: 200,
        message: `Successfully found contact with id ${contactId}!`,
        data: contact,
      });
    } catch (error) {
      console.log('error in get data /contacts/:contactId', error);
    }
  });

  app.use(notFoundMiddleware);

  app.use(errorHandlerMiddleware);

  app.listen(PORT, () => {});
};
