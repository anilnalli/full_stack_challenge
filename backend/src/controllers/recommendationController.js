import { RecommendationService } from '../services/RecommendationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/responseHelper.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import { HTTP_STATUS } from '../constants/index.js';

const recommendationService = new RecommendationService();

/**
 * Generate Recommendations Controller
 */
export const generateRecommendations = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const recommendations = await recommendationService.generateRecommendations(userId);

  sendSuccess(res, HTTP_STATUS.OK, 'Recommendations generated successfully', recommendations);
});

/**
 * Get Recommendations Controller
 */
export const getRecommendations = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPaginationParams(req.query);
  const userId = req.user.id;

  const { recommendations, total } = await recommendationService.getRecommendations(
    userId,
    skip,
    limit
  );

  sendSuccess(res, HTTP_STATUS.OK, 'Recommendations retrieved successfully', recommendations, {
    ...getPaginationMeta(page, limit, total),
  });
});

/**
 * Get Next Recommended Lesson Controller
 */
export const getNextRecommendedLesson = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const lesson = await recommendationService.getNextRecommendedLesson(userId);

  sendSuccess(res, HTTP_STATUS.OK, 'Next recommended lesson retrieved successfully', lesson);
});

/**
 * Mark Recommendation as Viewed Controller
 */
export const markRecommendationAsViewed = asyncHandler(async (req, res) => {
  const { recommendationId } = req.params;

  const recommendation = await recommendationService.markRecommationAsViewed(recommendationId);

  sendSuccess(res, HTTP_STATUS.OK, 'Recommendation marked as viewed', recommendation);
});
