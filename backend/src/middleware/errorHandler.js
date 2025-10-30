import { sendError } from '../utils/httpResponses.js';
import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
  if (!err) {
    return next();
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || {};

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.keys(err.errors || {}).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {});
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier supplied';
    errors = { [err.path]: 'Invalid value' };
  }

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired authentication token';
  }

  if (err.code && err.code === 11000) {
    statusCode = 409;
    message = 'Resource already exists';
    errors = err.keyValue;
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const errorDetails = isProduction ? errors : { ...errors, stack: err.stack };

  logger.error(`${message} - ${req.method} ${req.originalUrl}`, {
    statusCode,
    errors,
    stack: err.stack,
  });

  return sendError(res, statusCode, message, errorDetails);
};

export default errorHandler;
