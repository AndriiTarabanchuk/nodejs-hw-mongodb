import Joi from 'joi';
import { ROLES } from '../constants/index.js';

export const registerUserValidSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid(ROLES.TEACHER, ROLES.PARENT).required(),
});

export const loginUserValidSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
