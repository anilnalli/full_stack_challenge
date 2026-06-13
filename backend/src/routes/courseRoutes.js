import { Router } from 'express';
import {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  createSection,
  createLesson,
  enrollCourse,
  getStudentEnrollments,
  updateLessonProgress,
} from '../controllers/courseController.js';
import {
  validateCreateCourse,
  validateUpdateCourse,
  validateCreateSection,
  validateCreateLesson,
  validateEnrollCourse,
  validateUpdateLessonProgress,
  validatePagination,
} from '../validators/index.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * Course Routes
 */

// POST /api/courses
router.post(
  '/',
  authenticate,
  authorize('MENTOR'),
  validateCreateCourse,
  handleValidationErrors,
  createCourse
);

// GET /api/courses
router.get('/', validatePagination, handleValidationErrors, getAllCourses);

// GET /api/courses/:courseId
router.get('/:courseId', getCourseById);

// PUT /api/courses/:courseId
router.put(
  '/:courseId',
  authenticate,
  authorize('MENTOR'),
  validateUpdateCourse,
  handleValidationErrors,
  updateCourse
);

// DELETE /api/courses/:courseId
router.delete(
  '/:courseId',
  authenticate,
  authorize('MENTOR'),
  deleteCourse
);

/**
 * Section Routes
 */

// POST /api/courses/:courseId/sections
router.post(
  '/:courseId/sections',
  authenticate,
  authorize('MENTOR'),
  validateCreateSection,
  handleValidationErrors,
  createSection
);

/**
 * Lesson Routes
 */

// POST /api/courses/sections/:sectionId/lessons
router.post(
  '/sections/:sectionId/lessons',
  authenticate,
  authorize('MENTOR'),
  validateCreateLesson,
  handleValidationErrors,
  createLesson
);

/**
 * Enrollment Routes
 */

// POST /api/courses/:courseId/enroll
router.post(
  '/:courseId/enroll',
  authenticate,
  authorize('STUDENT'),
  validateEnrollCourse,
  handleValidationErrors,
  enrollCourse
);

// GET /api/courses/enrollments (get student's enrollments)
router.get(
  '/my/enrollments',
  authenticate,
  authorize('STUDENT'),
  validatePagination,
  handleValidationErrors,
  getStudentEnrollments
);

/**
 * Lesson Progress Routes
 */

// PUT /api/courses/progress/:progressId
router.put(
  '/progress/:progressId',
  authenticate,
  authorize('STUDENT'),
  validateUpdateLessonProgress,
  handleValidationErrors,
  updateLessonProgress
);

export default router;
