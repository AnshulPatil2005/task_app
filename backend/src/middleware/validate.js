import { validationResult } from 'express-validator';
import { sendError } from '../utils/httpResponses.js';

const validate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formatted = errors.array().reduce((acc, err) => {
      acc[err.param] = err.msg;
      return acc;
    }, {});
    return sendError(res, 400, 'Validation failed', formatted);
  }

  return next();
};

export default validate;
