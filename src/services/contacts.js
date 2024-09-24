import createHttpError from 'http-errors';
import { contactsModel } from '../db/models/contacts.js';

export const getContacts = async () => {
  const contacts = await contactsModel.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await contactsModel.findById(contactId);
  return contact;
};

export const createContact = async (payload) => {
  return await contactsModel.create(payload);
};

export const updateContact = async (contactId, payload, options = {}) => {
  const rawResult = await contactsModel.findByIdAndUpdate(contactId, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  return {
    contact: rawResult.value,
    isNew: !rawResult.lastErrorObject.updatedExisting,
  };
};
