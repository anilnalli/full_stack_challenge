import { Router } from 'express';
import {
  getUserActivityHistory,
  exportActivityHistoryCSV,
} from '../controllers/activityController.js';
import { validatePagination } from '../validators/index.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * Activity Routes
 */

// GET /api/activities
router.get(
  '/',
  authenticate,
  validatePagination,
  handleValidationErrors,
  getUserActivityHistory
);

// GET /api/activities/export
router.get(
  '/export',
  authenticate,
  exportActivityHistoryCSV
);

export default router;
