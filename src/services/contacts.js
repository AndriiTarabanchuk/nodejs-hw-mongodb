import { contactsModel } from '../db/models/contacts.js';

const getAllContacts = async () => {
  const contacts = await contactsModel.find();
  return contacts;
};

const getContactById = async (studentId) => {
  const contact = await contactsModel.findById(studentId);
  return contact;
};

export default { getAllContacts, getContactById };
