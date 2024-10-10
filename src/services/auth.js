import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { SessionsCollection } from '../db/models/sessions.js';
import bcrypt from 'bcrypt';
import {
  ACCESS_TOKEN_LIVE_TIME,
  REFRESH_TOKEN_LIVE_TIME,
} from '../constants/index.js';
import { randomBytes } from 'crypto';

export const registerUserService = async (payload) => {
  let user = await UsersCollection.findOne({ email: payload.email }); // check unique email in base

  if (user !== null) {
    throw createHttpError(409, 'Email in use!');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10); //adds-hash-pass
  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

const createSession = () => ({
  accessToken: randomBytes(30).toString('base64'),
  refreshToken: randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
  refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIVE_TIME),
});

export const loginUserService = async (payload) => {
  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    //   throw createHttpError(404, 'User not found!');
    throw createHttpError(401, 'Unauthorized!');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized!');
  }
  await SessionsCollection.deleteOne({ userId: user._id });

  const newSession = await SessionsCollection.create({
    userId: user._id,
    ...createSession(),
  });
  return newSession;
};
