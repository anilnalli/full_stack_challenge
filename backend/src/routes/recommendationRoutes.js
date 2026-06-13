import { Router } from 'express';
import {
  generateRecommendations,
  getRecommendations,
  getNextRecommendedLesson,
  markRecommendationAsViewed,
} from '../controllers/recommendationController.js';
import { validatePagination } from '../validators/index.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

/**
 * Recommendation Routes
 */

// POST /api/recommendations/generate
router.post(
  '/generate',
  authenticate,
  authorize('STUDENT'),
  generateRecommendations
);

// GET /api/recommendations
router.get(
  '/',
  authenticate,
  authorize('STUDENT'),
  validatePagination,
  handleValidationErrors,
  getRecommendations
);

// GET /api/recommendations/next
router.get(
  '/next',
  authenticate,
  authorize('STUDENT'),
  getNextRecommendedLesson
);

// PUT /api/recommendations/:recommendationId/view
router.put(
  '/:recommendationId/view',
  authenticate,
  authorize('STUDENT'),
  markRecommendationAsViewed
);

export default router;
