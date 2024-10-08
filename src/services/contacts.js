import createHttpError from 'http-errors';
import { contactsModel } from '../db/models/contacts.js';
import { createPaginationData } from '../utils/createPaginationData.js';

export const getContacts = async (
  page = 1,
  perPage = 10,
  sortBy = 'name',
  sortOrder = 'asc',
  filter = {},
) => {
  const skip = (page - 1) * perPage;
  const contactQuery = contactsModel.find();

  if (filter.isFavourite) {
    contactQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.contactType) {
    contactQuery.where('contactType').equals(filter.contactType);
  }

  const [count, data] = await Promise.all([
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
  return { data, ...createPaginationData(count, page, perPage) };
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

export const deleteContact = async (contactId) => {
  const contact = await contactsModel.findByIdAndDelete({
    _id: contactId,
  });
  return contact;
};
