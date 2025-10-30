export class ApiError extends Error {
  constructor(statusCode, message, errors = {}) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export const sendSuccess = (res, statusCode, message, data = {}, meta) => {
  const payload = {
    success: true,
    message,
    data,
    errors: null,
  };

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

export const sendError = (res, statusCode, message, errors = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors,
  });
};
