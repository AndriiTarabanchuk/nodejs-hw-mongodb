import Joi from 'joi';
import { CONTACT_TYPE } from '../constants/inde.js';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  phoneNumber: Joi.string().min(13).required(),
  email: Joi.string().email().required(),
  isFavourite: Joi.boolean().default(false).required(),
  contactType: Joi.string()
    .valid(CONTACT_TYPE.PERSONAL, CONTACT_TYPE.HOME, CONTACT_TYPE.WORK)
    .default(CONTACT_TYPE.PERSONAL)
    .required(),
  userId: Joi.string().required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  phoneNumber: Joi.string().min(13),
  email: Joi.string().email(),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string().valid(
    (CONTACT_TYPE.PERSONAL, CONTACT_TYPE.HOME, CONTACT_TYPE.WORK),
  ),
  userId: Joi.string(),
});
