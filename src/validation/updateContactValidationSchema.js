import Joi from 'joi';

export const updateContactValidationSchema = Joi.object({
  name: Joi.string().min(3).max(30),
  phoneNumber: Joi.string().min(13),
  email: Joi.string().email(),
  isFavourite: Joi.boolean().default(false),
  contactType: Joi.string()
    .valid('personal', 'home', 'work')
    .default('personal'),
});
