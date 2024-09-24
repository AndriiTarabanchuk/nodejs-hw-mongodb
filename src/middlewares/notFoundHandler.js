import createHttpError from 'http-errors';

const notFoundHandler = (req, res, next) => {
  return next(createHttpError(404, 'Route not Found'));
};
export default notFoundHandler;
