import createHttpError from 'http-errors';

import {
  createContact,
  getContactById,
  getContacts,
  updateContact,
} from '../services/contacts.js';

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
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact.`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const { body } = req;
  const contact = await createContact(body);
  res.status(201).send({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const { contactId } = req.params;
  const { body } = req;

  const rawResult = await updateContact(contactId, body);
  if (!rawResult.contact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.send({
    status: 200,
    message: 'Successfully updated a contact!',
    data: rawResult.contact,
  });
};