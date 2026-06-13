import { verifyAccessToken } from '../utils/jwtUtils.js';
import { AuthenticationError, AuthorizationError } from '../errors/AppError.js';
import { sendError } from '../utils/responseHelper.js';

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header or cookies
 */
export const authenticate = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;

    if (!token) {
      throw new AuthenticationError('No token provided');
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      throw new AuthenticationError('Invalid or expired token');
    }

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    sendError(res, error.statusCode || 401, error.message);
  }
};

/**
 * Authorization Middleware Factory
 * Checks if user has required role(s)
 */
export const authorize = (...allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return sendError(res, 401, 'Authentication required');
  }

  if (!allowedRoles.includes(req.user.role)) {
    return sendError(
      res,
      403,
      'You do not have permission to access this resource'
    );
  }

  next();
};

/**
 * Optional Auth Middleware
 * Attaches user if token exists, otherwise continues
 */
export const optionalAuth = (req, res, next) => {
  try {
    const token =
      req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;

    if (token) {
      const decoded = verifyAccessToken(token);
      if (decoded) {
        req.user = {
          id: decoded.id,
          role: decoded.role,
        };
      }
    }

    next();
  } catch (error) {
    // Continue even if token verification fails
    next();
  }
};
