import createHttpError from 'http-errors';
import { Users } from '../db/models/users.js';
import bcrypt from 'bcrypt';

export const registerUserService = async (payload) => {
  let user = await Users.findOne({ email: payload.email }); // check unic email in base

  if (user !== null) {
    throw createHttpError(409, 'Email in use!');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10); //adds-hesh-pass
  return await Users.create({
    ...payload,
    password: encryptedPassword,
  });
};
