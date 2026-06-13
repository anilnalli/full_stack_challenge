import { Router } from 'express';
import {
  getDashboardSummary,
  getProgressByCourse,
  getTimeSeriesData,
  getDailyLearningActivity,
  getWeeklyLearningActivity,
  getMonthlyLearningActivity,
  getActivityHistory,
  getMentorDashboardOverview,
  exportDashboardSummary,
} from '../controllers/analyticsController.js';
import { validatePagination } from '../validators/index.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * Analytics Routes
 */

// GET /api/analytics/dashboard
router.get(
  '/dashboard',
  authenticate,
  authorize('STUDENT'),
  getDashboardSummary
);

// GET /api/analytics/progress
router.get(
  '/progress',
  authenticate,
  authorize('STUDENT'),
  validatePagination,
  handleValidationErrors,
  getProgressByCourse
);

// GET /api/analytics/time-series
router.get(
  '/time-series',
  authenticate,
  authorize('STUDENT'),
  getTimeSeriesData
);

// GET /api/analytics/daily-activity
router.get(
  '/daily-activity',
  authenticate,
  authorize('STUDENT'),
  getDailyLearningActivity
);

// GET /api/analytics/weekly-activity
router.get(
  '/weekly-activity',
  authenticate,
  authorize('STUDENT'),
  getWeeklyLearningActivity
);

// GET /api/analytics/monthly-activity
router.get(
  '/monthly-activity',
  authenticate,
  authorize('STUDENT'),
  getMonthlyLearningActivity
);

// GET /api/analytics/activity-history
router.get(
  '/activity-history',
  authenticate,
  authorize('STUDENT'),
  validatePagination,
  handleValidationErrors,
  getActivityHistory
);

// GET /api/analytics/mentor/overview
router.get(
  '/mentor/overview',
  authenticate,
  authorize('MENTOR'),
  getMentorDashboardOverview
);

// GET /api/analytics/export
router.get(
  '/export',
  authenticate,
  authorize('STUDENT'),
  exportDashboardSummary
);

export default router;
