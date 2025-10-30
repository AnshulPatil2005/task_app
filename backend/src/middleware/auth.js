import jwt from 'jsonwebtoken';
import { sendError } from '../utils/httpResponses.js';

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    return sendError(res, 401, 'Authentication required', { token: 'Missing Bearer token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id, role: decoded.role };
    return next();
  } catch (error) {
    return sendError(res, 401, 'Invalid or expired token', { token: 'Access denied' });
  }
};

export default auth;
