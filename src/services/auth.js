import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { SessionsCollection } from '../db/models/sessions.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import {
  ACCESS_TOKEN_LIVE_TIME,
  REFRESH_TOKEN_LIVE_TIME,
} from '../constants/index.js';

export const registerUserService = async (payload) => {
  let user = await UsersCollection.findOne({ email: payload.email }); // check unique email in base

  if (user !== null) {
    return createHttpError(409, 'Email in use!');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10); //adds-hash-pass
  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

const createSession = () => ({
  accessToken: crypto.randomBytes(30).toString('base64'),
  refreshToken: crypto.randomBytes(30).toString('base64'),
  accessTokenValidUntil: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
  refreshTokenValidUntil: new Date(Date.now() + REFRESH_TOKEN_LIVE_TIME),
});

export const loginUserService = async (payload) => {
  let user = await UsersCollection.findOne({ email: payload.email });
  if (!user) {
    //   throw createHttpError(404, 'User not found!');
    return createHttpError(401, 'Unauthorized!');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    return createHttpError(401, 'Unauthorized!');
  }

  await SessionsCollection.findOneAndDelete({ userId: user._id });

  const newSession = await SessionsCollection.create({
    userId: user._id,
    ...createSession(),
  });
  return newSession;
};

export const refreshUsersSessionService = async ({
  sessionId,
  sessionToken,
}) => {
  const session = await SessionsCollection.findOne({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  if (!session) {
    return createHttpError(401, 'Session not found!');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);

  if (isSessionTokenExpired) {
    return createHttpError(401, 'Session token expired!');
  }
  const userId = session.userId;
  await SessionsCollection.findOneAndDelete({
    _id: sessionId,
    refreshToken: sessionToken,
  });

  const newSession = await SessionsCollection.create({
    userId: userId,
    ...createSession(),
  });
  return newSession;
};

export const logoutUserService = async (sessionId, sessionToken) => {
  await SessionsCollection.findOneAndDelete({
    _id: sessionId,
    refreshToken: sessionToken,
  });
};
