import { UsersCollection } from '../db/models/users.js';
import { SessionsCollection } from '../db/models/sessions.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import {
  ACCESS_TOKEN_LIVE_TIME,
  REFRESH_TOKEN_LIVE_TIME,
  SMTP,
  TEMPLATES_DIR,
} from '../constants/index.js';
import createHttpError from 'http-errors';

import { env } from '../utils/env.js';
import jwt from 'jsonwebtoken';
import { sendEmailClient } from '../utils/sendEmailClient.js';

import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

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
    throw createHttpError(404, 'User not found!');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);

  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized!');
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

export const sendMailService = async ({ email }) => {
  const user = await UsersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env(SMTP.JWT_SECRET),
    {
      expiresIn: 60 * 5, // 5min
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-password?token=${resetToken}`,
  });

  const options = {
    from: `Reset Token <${env(SMTP.SMTP_FROM)}>`, // sender address '"Maddison Foo Koch 👻" <explorituse@gmail.com>'
    to: email, // list of receivers
    subject: 'Reset your password', // Subject line
    text: 'Click to link to get resetToken', // plain text body
    html: html,
    // html: `<p>Click <a href= "https://${env(
    //   SMTP.FRONTEND_DOMAIN,
    // )}/reset-password?token=<${jwtToken}>">here</a> to reset your password!</p>`, // html body
  };
  let info;
  try {
    info = await sendEmailClient(options);
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
  return info;
};
