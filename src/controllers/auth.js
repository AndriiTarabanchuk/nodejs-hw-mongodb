// import createHttpError from 'http-errors';
import { ACCESS_TOKEN_LIVE_TIME } from '../constants/index.js';
import {
  loginUserService,
  logoutUserService,
  refreshUsersSessionService,
  registerUserService,
  requestResetTokenService,
  resetPassword,
} from '../services/auth.js';
import { serializeUser } from '../utils/serializeUser.js';
import createHttpError from 'http-errors';

export const registerUserController = async (req, res) => {
  const user = await registerUserService(req.body);
  res.json({
    status: 201,
    message: 'Successfully registered a user!',
    data: serializeUser(user),
  });
};

const setupSession = (res, session) => {
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
  });
  res.cookie('sessionToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ACCESS_TOKEN_LIVE_TIME),
  });
};

export const loginUserController = async (req, res, next) => {
  const session = await loginUserService(req.body);

  if (!session) {
    throw createHttpError(401, 'Session not found!');
  }

  setupSession(res, session);

  res.json({
    status: 200,
    message: `Successfully logged in an user!`,
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const refreshUserSessionController = async (req, res) => {
  const session = await refreshUsersSessionService({
    sessionId: req.cookies.sessionId,
    sessionToken: req.cookies.sessionToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session not found!');
  }

  setupSession(res, session);

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutUserController = async (req, res) => {
  await logoutUserService(req.cookies.sessionId, req.cookies.sessionToken);
  res.clearCookie('sessionId');
  res.clearCookie('sessionToken');
  res.status(204).send();
};

export const requestResetEmailController = async (req, res) => {
  const { email } = req.body;
  await requestResetTokenService({ email });
  res.json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  await resetPassword(req.body);
  res.json({
    message: 'Password was successfully reset!',
    status: 200,
    data: {},
  });
};
