import {
  createContact,
  getContactById,
  getContacts,
} from '../services/contacts.js';

import createError from 'http-errors';

export const getContactsController = async (req, res) => {
  const contacts = await getContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    dataLen: contacts.length,
    data: contacts,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    return next(createError(404, 'Contact not found'));
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}.`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { body } = req;
  const contact = await createContact(body);
  res.status(201).send({
    status: 201,
    message: `Successfully created Contact!`,
    data: contact,
  });
};
