import { ActivityService } from '../services/ActivityService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/responseHelper.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import { HTTP_STATUS } from '../constants/index.js';

const activityService = new ActivityService();

/**
 * Get User Activity History Controller
 */
export const getUserActivityHistory = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPaginationParams(req.query);
  const userId = req.user.id;

  const { activities, total } = await activityService.getUserActivityHistory(userId, skip, limit);

  sendSuccess(res, HTTP_STATUS.OK, 'Activity history retrieved successfully', activities, {
    ...getPaginationMeta(page, limit, total),
  });
});

/**
 * Export Activity History as CSV Controller
 */
export const exportActivityHistoryCSV = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const csv = await activityService.exportActivityHistoryAsCSV(userId);

  res.header('Content-Type', 'text/csv');
  res.header('Content-Disposition', 'attachment; filename="activity-history.csv"');
  res.send(csv);
});
