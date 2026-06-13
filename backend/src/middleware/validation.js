import { validationResult } from 'express-validator';
import { sendError } from '../utils/responseHelper.js';

/**
 * Validation Result Handler Middleware
 * Extracts and formats validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg,
      value: error.value,
    }));

    return sendError(res, 400, 'Validation failed', formattedErrors);
  }

  next();
};
