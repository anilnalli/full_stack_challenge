import { AuthService } from '../services/AuthService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess, sendError } from '../utils/responseHelper.js';
import { HTTP_STATUS } from '../constants/index.js';

const authService = new AuthService();

/**
 * Register Controller
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName, role } = req.body;

  const result = await authService.register(email, password, firstName, lastName, role);

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  sendSuccess(res, HTTP_STATUS.CREATED, 'User registered successfully', {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
});

/**
 * Login Controller
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const result = await authService.login(email, password);

  res.cookie('accessToken', result.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  sendSuccess(res, HTTP_STATUS.OK, 'Login successful', {
    user: result.user,
    accessToken: result.accessToken,
    refreshToken: result.refreshToken,
  });
});

/**
 * Get Current User Controller
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await authService.getUserById(req.user.id);

  sendSuccess(res, HTTP_STATUS.OK, 'User retrieved successfully', {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
  });
});

/**
 * Logout Controller
 */
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('accessToken');
  sendSuccess(res, HTTP_STATUS.OK, 'Logout successful');
});
