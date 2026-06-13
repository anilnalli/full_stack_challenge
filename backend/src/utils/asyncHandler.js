/**
 * Helper for async route handlers
 * Eliminates the need for try-catch blocks in every controller
 */

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
