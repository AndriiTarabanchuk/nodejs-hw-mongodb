export const serializeContact = (contact) => {
  return {
    _id: contact._id,
    name: contact.name,
    phoneNumber: contact.phoneNumber,
    email: contact.email,
    isFavourite: contact.isFavourite,
    contactType: contact.contactType,
    photo: contact.photo,
  };
};
