import { UsersCollection } from '../db/models/users.js';
import { SessionsCollection } from '../db/models/sessions.js';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import {
  ACCESS_TOKEN_LIVE_TIME,
  REFRESH_TOKEN_LIVE_TIME,
  SMTP,
} from '../constants/index.js';
import createHttpError from 'http-errors';

import { env } from '../utils/env.js';
import jwt from 'jsonwebtoken';
import { sendEmailClient } from '../utils/sendEmailClient.js';

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
      expiresIn: 60 * 15, //15min
    },
  );

  const options = {
    from: `Reset Token <${env(SMTP.SMTP_FROM)}>`, // sender address '"Maddison Foo Koch 👻" <explorituse@gmail.com>'
    to: email, // list of receivers
    subject: 'Reset token ✔', // Subject line
    text: 'Click to get a link resetToken', // plain text body
    html: `<p>Click <a href="${resetToken}">here</a> to reset your password!</p>`, // html body
  };

  // const transporter = nodemailer.createTransport({
  //   host: env(SMTP.SMTP_HOST),
  //   port: env(SMTP.SMTP_PORT),
  //   secure: false, // true for port 465, false for other ports
  //   auth: {
  //     user: env(SMTP.SMTP_USER),
  //     pass: env(SMTP.SMTP_PASSWORD),
  //   },
  // });

  // async..await is not allowed in global scope, must use a wrapper
  // async function main(options) {
  //   // send mail with defined transport object
  //   const info = await transporter.sendMail(options);
  //   // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  //   return info;
  // }
  const info = sendEmailClient(options);
  return info;
};
