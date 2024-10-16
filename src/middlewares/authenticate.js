import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { SessionsCollection } from '../db/models/sessions.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createHttpError(401, 'Please provide Authorization header!')); //get valid authorization
    return;
  }
  const [bearer, token] = authHeader.split(' ');

  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401, 'Auth header must be type of Bearer!')); //get valid Bearer
    return;
  }

  const session = await SessionsCollection.findOne({ accessToken: token });
  if (!session) {
    next(createHttpError(401, 'Session not found!')); //get valid session
    return;
  }

  if (!session.accessTokenValidUntil > Date.now()) {
    next(createHttpError(401, 'Auth token is expired!')); ///fault time
    return;
  }
  const user = await UsersCollection.findOne({ _id: session.userId });

  if (!user) {
    next(createHttpError(401, 'No user is associated with any session!')); //get valid session
    return;
  }
  res.user = user;
  next();
};
