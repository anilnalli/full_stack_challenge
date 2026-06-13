import apiClient from './client';

/**
 * Auth API endpoints
 */
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  getCurrentUser: () => apiClient.get('/auth/me'),
  logout: () => apiClient.post('/auth/logout'),
};

/**
 * Courses API endpoints
 */
export const coursesAPI = {
  getAllCourses: (page = 1, limit = 10) =>
    apiClient.get('/courses', { params: { page, limit } }),
  getCourseById: (courseId) => apiClient.get(`/courses/${courseId}`),
  createCourse: (data) => apiClient.post('/courses', data),
  updateCourse: (courseId, data) => apiClient.put(`/courses/${courseId}`, data),
  deleteCourse: (courseId) => apiClient.delete(`/courses/${courseId}`),
  enrollCourse: (courseId) => apiClient.post(`/courses/${courseId}/enroll`),
  getMyEnrollments: (page = 1, limit = 10) =>
    apiClient.get('/courses/my/enrollments', { params: { page, limit } }),
  updateLessonProgress: (progressId, data) =>
    apiClient.put(`/courses/progress/${progressId}`, data),
};

/**
 * Analytics API endpoints
 */
export const analyticsAPI = {
  getDashboardSummary: () => apiClient.get('/analytics/dashboard'),
  getProgressByCourse: (page = 1, limit = 10) =>
    apiClient.get('/analytics/progress', { params: { page, limit } }),
  getDailyActivity: (days = 7) =>
    apiClient.get('/analytics/daily-activity', { params: { days } }),
  getWeeklyActivity: (weeks = 4) =>
    apiClient.get('/analytics/weekly-activity', { params: { weeks } }),
  getMonthlyActivity: (months = 6) =>
    apiClient.get('/analytics/monthly-activity', { params: { months } }),
  getActivityHistory: (page = 1, limit = 10) =>
    apiClient.get('/analytics/activity-history', { params: { page, limit } }),
  getMentorDashboard: () => apiClient.get('/analytics/mentor/overview'),
  exportDashboard: () => apiClient.get('/analytics/export'),
};

/**
 * Recommendations API endpoints
 */
export const recommendationsAPI = {
  generateRecommendations: () => apiClient.post('/recommendations/generate'),
  getRecommendations: (page = 1, limit = 5) =>
    apiClient.get('/recommendations', { params: { page, limit } }),
  getNextRecommendedLesson: () => apiClient.get('/recommendations/next'),
  markAsViewed: (recommendationId) =>
    apiClient.put(`/recommendations/${recommendationId}/view`),
};

/**
 * Activities API endpoints
 */
export const activitiesAPI = {
  getActivityHistory: (page = 1, limit = 10) =>
    apiClient.get('/activities', { params: { page, limit } }),
  exportActivityHistory: () => apiClient.get('/activities/export'),
};
