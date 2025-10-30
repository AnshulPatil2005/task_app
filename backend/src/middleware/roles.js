import { sendError } from '../utils/httpResponses.js';

const roles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return sendError(res, 403, 'Forbidden', { role: 'Insufficient permissions' });
    }

    return next();
  };

export default roles;
