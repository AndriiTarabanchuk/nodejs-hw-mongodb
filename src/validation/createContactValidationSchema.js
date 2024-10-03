import Joi from 'joi';

export const createContactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(20).required(),
  phoneNumber: Joi.string().min(3).max(20).required(),
  email: Joi.string().min(3).max(20).email().default(null).required(),
  isFavourite: Joi.boolean().default(false).required(),
  contactType: Joi.string()
    .valid('personal', 'home', 'work')
    .default('personal')
    .required(),
});
