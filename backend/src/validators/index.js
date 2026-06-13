import { body, param, query } from 'express-validator';

/**
 * Authentication Validators
 */

export const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),
  body('role')
    .isIn(['STUDENT', 'MENTOR'])
    .withMessage('Role must be STUDENT or MENTOR'),
];

export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

/**
 * Course Validators
 */

export const validateCreateCourse = [
  body('title')
    .trim()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('Course title is required (minimum 3 characters)'),
  body('description')
    .optional()
    .trim(),
];

export const validateUpdateCourse = [
  param('id').isString().withMessage('Valid course ID is required'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage('Course title must be at least 3 characters'),
  body('description')
    .optional()
    .trim(),
];

/**
 * Section Validators
 */

export const validateCreateSection = [
  param('courseId').isString().withMessage('Valid course ID is required'),
  body('title')
    .trim()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('Section title is required (minimum 3 characters)'),
  body('order')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
];

/**
 * Lesson Validators
 */

export const validateCreateLesson = [
  param('sectionId').isString().withMessage('Valid section ID is required'),
  body('title')
    .trim()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage('Lesson title is required (minimum 3 characters)'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Lesson duration must be a positive integer (in minutes)'),
  body('order')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
];

/**
 * Enrollment Validators
 */

export const validateEnrollCourse = [
  param('courseId').isString().withMessage('Valid course ID is required'),
];

/**
 * Lesson Progress Validators
 */

export const validateUpdateLessonProgress = [
  param('progressId').isString().withMessage('Valid progress ID is required'),
  body('status')
    .optional()
    .isIn(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'])
    .withMessage('Invalid status'),
  body('timeSpent')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Time spent must be a non-negative integer'),
];

/**
 * Pagination Validators
 */

export const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

/**
 * Search/Filter Validators
 */

export const validateSearchFilters = [
  query('search')
    .optional()
    .trim(),
  query('status')
    .optional()
    .isIn(['IN_PROGRESS', 'COMPLETED', 'ABANDONED', 'NOT_STARTED'])
    .withMessage('Invalid status filter'),
  query('courseId')
    .optional()
    .isString()
    .withMessage('Valid course ID is required'),
];
