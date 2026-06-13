import { AnalyticsService } from '../services/AnalyticsService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/responseHelper.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import { HTTP_STATUS } from '../constants/index.js';

const analyticsService = new AnalyticsService();

/**
 * Get Dashboard Summary Controller
 */
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const summary = await analyticsService.getStudentDashboardSummary(userId);

  sendSuccess(res, HTTP_STATUS.OK, 'Dashboard summary retrieved successfully', summary);
});

/**
 * Get Progress by Course Controller
 */
export const getProgressByCourse = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPaginationParams(req.query);
  const userId = req.user.id;

  const progress = await analyticsService.getProgressByCourse(userId, skip, limit);

  sendSuccess(res, HTTP_STATUS.OK, 'Course progress retrieved successfully', progress, {
    ...getPaginationMeta(page, limit, progress.length),
  });
});

/**
 * Get Time Series Data Controller
 */
export const getTimeSeriesData = asyncHandler(async (req, res) => {
  const { startDate, endDate, groupBy = 'daily' } = req.query;
  const userId = req.user.id;

  const data = await analyticsService.getTimeSeriesData(
    userId,
    new Date(startDate),
    new Date(endDate),
    groupBy
  );

  sendSuccess(res, HTTP_STATUS.OK, 'Time series data retrieved successfully', data);
});

/**
 * Get Daily Learning Activity Controller
 */
export const getDailyLearningActivity = asyncHandler(async (req, res) => {
  const { days = 7 } = req.query;
  const userId = req.user.id;

  const activity = await analyticsService.getDailyLearningActivity(userId, parseInt(days));

  sendSuccess(res, HTTP_STATUS.OK, 'Daily activity retrieved successfully', activity);
});

/**
 * Get Weekly Learning Activity Controller
 */
export const getWeeklyLearningActivity = asyncHandler(async (req, res) => {
  const { weeks = 4 } = req.query;
  const userId = req.user.id;

  const activity = await analyticsService.getWeeklyLearningActivity(
    userId,
    parseInt(weeks)
  );

  sendSuccess(res, HTTP_STATUS.OK, 'Weekly activity retrieved successfully', activity);
});

/**
 * Get Monthly Learning Activity Controller
 */
export const getMonthlyLearningActivity = asyncHandler(async (req, res) => {
  const { months = 6 } = req.query;
  const userId = req.user.id;

  const activity = await analyticsService.getMonthlyLearningActivity(
    userId,
    parseInt(months)
  );

  sendSuccess(res, HTTP_STATUS.OK, 'Monthly activity retrieved successfully', activity);
});

/**
 * Get Activity History Controller
 */
export const getActivityHistory = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPaginationParams(req.query);
  const userId = req.user.id;

  const { activities, total } = await analyticsService.getActivityHistory(userId, skip, limit);

  sendSuccess(res, HTTP_STATUS.OK, 'Activity history retrieved successfully', activities, {
    ...getPaginationMeta(page, limit, total),
  });
});

/**
 * Get Mentor Dashboard Overview Controller
 */
export const getMentorDashboardOverview = asyncHandler(async (req, res) => {
  const mentorId = req.user.id;

  const overview = await analyticsService.getMentorDashboardOverview(mentorId);

  sendSuccess(res, HTTP_STATUS.OK, 'Mentor dashboard overview retrieved successfully', overview);
});

/**
 * Export Dashboard Summary as CSV Controller
 */
export const exportDashboardSummary = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const summary = await analyticsService.getStudentDashboardSummary(userId);

  const csv = `Student Learning Analytics Dashboard\n\n${JSON.stringify(summary, null, 2)}`;

  res.header('Content-Type', 'text/csv');
  res.header('Content-Disposition', 'attachment; filename="dashboard-summary.csv"');
  res.send(csv);
});
