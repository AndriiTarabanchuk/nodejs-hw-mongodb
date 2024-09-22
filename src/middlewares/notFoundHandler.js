import createError from 'http-errors';

const notFoundHandler = (req, res, next) => {
  return next(createError(404, 'Route not Found'));
};
export default notFoundHandler;
