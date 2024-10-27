import createHttpError from 'http-errors';
import { contactsModel } from '../db/models/contacts.js';
import { createPaginationData } from '../utils/createPaginationData.js';
import { serializeContact } from '../utils/serializeContact.js';

export const getContacts = async (
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
  userId = {},
) => {
  const skip = (page - 1) * perPage;
  const contactQuery = contactsModel.find({ userId: userId });

  if (filter.isFavourite) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.contactType) {
    contactQuery.where('contactType').equals(filter.contactType);
  }

  const [count, dataGet] = await Promise.all([
    contactsModel.find().merge(contactQuery).countDocuments(),
    contactsModel
      .find()
      .merge(contactQuery)
      .skip(skip)
      .limit(perPage)
      .sort({
        [sortBy]: sortOrder,
      })
      .exec(),
  ]);
  const data = await dataGet.map((item) => {
    return serializeContact(item);
  });
  return { data, ...createPaginationData(count, page, perPage) };
};

export const getContactById = async (id) => {
  const contact = await contactsModel.findOne(id);
  return serializeContact(contact);
};

export const createContact = async (payload) => {
  const contact = await contactsModel.create(payload);
  return serializeContact(contact);
};

export const updateContact = async (id, payload, options = {}) => {
  const rawResult = await contactsModel.findOneAndUpdate(id, payload, {
    new: true,
    includeResultMetadata: true,
    ...options,
  });

  return {
    contact: serializeContact(rawResult.value),
    isNew: !rawResult.lastErrorObject.updatedExisting,
  };
};

export const deleteContact = async (id) => {
  await contactsModel.findOneAndDelete(id);
  return;
};
