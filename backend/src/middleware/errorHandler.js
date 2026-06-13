import { AppError, ServerError } from '../errors/AppError.js';
import { sendError } from '../utils/responseHelper.js';
import morgan from 'morgan';

/**
 * Global Error Handler Middleware
 * Must be last middleware in the app
 */
export const errorHandler = (err, req, res, next) => {
  // Log error
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
  });

  // Default error
  if (!(err instanceof AppError)) {
    const serverError = new ServerError(
      process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    );
    return sendError(res, serverError.statusCode, serverError.message, serverError.errors);
  }

  sendError(res, err.statusCode, err.message, err.errors);
};

/**
 * 404 Not Found Handler
 */
export const notFoundHandler = (req, res) => {
  sendError(res, 404, `Route ${req.originalUrl} not found`);
};

/**
 * Request Logger Middleware
 */
export const requestLogger = morgan(':method :url :status :response-time ms');

/**
 * Request timeout middleware
 */
export const requestTimeout = (timeoutMs = 30000) => (req, res, next) => {
  req.setTimeout(timeoutMs);
  next();
};
