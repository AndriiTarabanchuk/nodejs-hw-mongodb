import { isHttpError } from 'http-errors';

const errorHandler = (err, req, res, next) => {
  if (isHttpError(err)) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      error: err,
    });
    return;
  }
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(500).json({
    status,
    message,
    err: err,
  });
};
export default errorHandler;
