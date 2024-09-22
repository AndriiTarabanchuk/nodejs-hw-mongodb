import { Router } from 'express';

import {
  getContactByIdController,
  getContactsController,
} from '../controllers/contacts.js';
// import { ctrlWrapper } from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get('/', getContactsController);
contactsRouter.get('/:contactId', getContactByIdController);

// contactsRouter.post('/', ctrlWrapper(createStudentController));

// contactsRouter.delete('/:studentId', ctrlWrapper(deleteStudentByIdController));

// contactsRouter.put('/:studentId', ctrlWrapper(putStudentController));

// contactsRouter.patch('/:studentId', ctrlWrapper(patchStudentController));

export default contactsRouter;
