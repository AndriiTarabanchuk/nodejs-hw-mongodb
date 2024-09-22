import { isHttpError } from 'http-errors';

const errorHandler = (err, req, res, next) => {
  if (isHttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.message,
      error: err.name,
    });
    return;
  }
  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
export default errorHandler;
