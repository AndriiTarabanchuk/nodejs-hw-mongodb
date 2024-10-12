import createHttpError from 'http-errors';

import mongoose from 'mongoose';
import pkg from 'mongoose';
const { ObjectID } = pkg;

import {
  createContact,
  deleteContact,
  getContactById,
  getContacts,
  updateContact,
} from '../services/contacts.js';
import { parsePaginationParams } from '../utils/validation/parsePaginationParams.js';
import { parseSortParams } from '../utils/validation/parseSortParams.js';
import { parseFilterParams } from '../utils/validation/parseFilterParams.js';

const getCurrentObjId = (userId, strId) => {
  const contactId = new mongoose.Types.ObjectId(strId.toString());
  return { _id: contactId, userId: userId };
};

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = res.user._id;

  const contactInfo = await getContacts(
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
    userId,
  );

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contactInfo,
  });
};

export const getContactByIdController = async (req, res, next) => {
  const id = getCurrentObjId(res.user._id, req.params.contactId);

  const contact = await getContactById(id);
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
  const userId = res.user._id;
  const { body } = req;
  const payload = { ...body, userId: userId };
  const contact = await createContact(payload);
  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const patchContactController = async (req, res, next) => {
  const id = getCurrentObjId(res.user._id, req.params.contactId);
  const { body } = req;
  const rawResult = await updateContact(id, body);
  if (!rawResult.contact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully updated a contact!',
    data: rawResult.contact,
  });
};

export const deleteContactByIdController = async (req, res, next) => {
  const id = getCurrentObjId(res.user._id, req.params.contactId);

  const contact = await deleteContact(id);
  if (!contact) {
    return next(createHttpError(404, 'Contact not found'));
  }
  res.status(204).send();
};
