import { getContactById, getContacts } from '../services/contacts.js';

// import createHttpError from 'http-errors';

export const getContactsController = async (req, res) => {
  try {
    const contacts = await getContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    console.log('Error retrieving data/contacts', error);
  }
};

export const getContactByIdController = async (req, res) => {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      res.status(404).json({
        status: 404,
        message: 'Contact not found',
      });
      return;
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}.`,
      data: contact,
    });
  } catch (error) {
    console.log('error in get data /contacts/:contactId', error);
  }
};
