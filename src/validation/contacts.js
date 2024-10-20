import Joi from 'joi';
import { CONTACT_TYPE } from '../constants/index.js';

export const createContactValidSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().min(13).required(),
  email: Joi.string().email().required(),
  isFavourite: Joi.boolean().default(false).required(),
  contactType: Joi.string()
    .valid(CONTACT_TYPE.PERSONAL, CONTACT_TYPE.HOME, CONTACT_TYPE.WORK)
    .required(),
  photo: Joi.string(),
});

export const updateContactValidSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  phoneNumber: Joi.string().min(13),
  email: Joi.string().email(),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string().valid(
    CONTACT_TYPE.PERSONAL,
    CONTACT_TYPE.HOME,
    CONTACT_TYPE.WORK,
  ),
  userId: Joi.string(),
  photo: Joi.string(),
});
