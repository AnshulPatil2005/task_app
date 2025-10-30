import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { sendSuccess, sendError } from '../utils/httpResponses.js';

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return sendError(res, 409, 'Email already registered', { email: 'Email already in use' });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: role || 'user',
    });

    const token = generateToken(user);

    return sendSuccess(res, 201, 'User registered successfully', {
      token,
      user: user.toClient(),
    });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return sendError(res, 401, 'Invalid credentials', { email: 'Incorrect email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 401, 'Invalid credentials', { password: 'Incorrect email or password' });
    }

    const token = generateToken(user);

    return sendSuccess(res, 200, 'Login successful', {
      token,
      user: user.toClient(),
    });
  } catch (error) {
    return next(error);
  }
};
