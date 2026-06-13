/**
 * Custom Application Error class
 * Centralized error handling for consistent API responses
 */
export class AppError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors,
    };
  }
}

/**
 * Validation Error - for request validation failures
 */
export class ValidationError extends AppError {
  constructor(message = 'Validation failed', errors = []) {
    super(400, message, errors);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Authentication Error - for auth failures
 */
export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(401, message);
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

/**
 * Authorization Error - for permission failures
 */
export class AuthorizationError extends AppError {
  constructor(message = 'You do not have permission to access this resource') {
    super(403, message);
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

/**
 * Not Found Error
 */
export class NotFoundError extends AppError {
  constructor(resource = 'Resource', id = '') {
    const message = id ? `${resource} with ID ${id} not found` : `${resource} not found`;
    super(404, message);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

/**
 * Conflict Error - for duplicate resources
 */
export class ConflictError extends AppError {
  constructor(message = 'Resource already exists') {
    super(409, message);
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

/**
 * Server Error - for unexpected errors
 */
export class ServerError extends AppError {
  constructor(message = 'Internal server error') {
    super(500, message);
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}
