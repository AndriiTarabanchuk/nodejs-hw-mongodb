import { Router } from 'express';

import {
  createContactController,
  deleteContactByIdController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../validation/validateBody.js';
import { createContactValidationSchema } from '../validation/createContactValidationSchema.js';
import { updateContactValidationSchema } from '../validation/updateContactValidationSchema.js';
import { isValidId } from '../validation/isValidId.js';

const contactsRouter = Router();

contactsRouter.get('/', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/:contactId',
  isValidId('contactId'),
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post(
  '/',
  validateBody(createContactValidationSchema),
  ctrlWrapper(createContactController),
);

contactsRouter.patch(
  '/:contactId',
  isValidId('contactId'),
  validateBody(updateContactValidationSchema),
  ctrlWrapper(patchContactController),
);

contactsRouter.delete(
  '/:contactId',
  isValidId('contactId'),
  ctrlWrapper(deleteContactByIdController),
);

export default contactsRouter;
