import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coursesAPI, analyticsAPI, recommendationsAPI } from '../services/api/endpoints';

/**
 * Custom hooks for API queries
 */

// Courses Hooks
export const useGetAllCourses = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['courses', page, limit],
    queryFn: () => coursesAPI.getAllCourses(page, limit),
    select: (data) => data.data,
  });
};

export const useGetCourseById = (courseId) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => coursesAPI.getCourseById(courseId),
    select: (data) => data.data.data,
    enabled: !!courseId,
  });
};

export const useEnrollCourse = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (courseId) => coursesAPI.enrollCourse(courseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
};

export const useGetMyEnrollments = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['enrollments', page, limit],
    queryFn: () => coursesAPI.getMyEnrollments(page, limit),
    select: (data) => data.data,
  });
};

export const useUpdateLessonProgress = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ progressId, data }) => coursesAPI.updateLessonProgress(progressId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
};

// Analytics Hooks
export const useGetDashboardSummary = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: () => analyticsAPI.getDashboardSummary(),
    select: (data) => data.data.data,
  });
};

export const useGetProgressByCourse = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['progress', page, limit],
    queryFn: () => analyticsAPI.getProgressByCourse(page, limit),
    select: (data) => data.data,
  });
};

export const useGetDailyActivity = (days = 7) => {
  return useQuery({
    queryKey: ['daily-activity', days],
    queryFn: () => analyticsAPI.getDailyActivity(days),
    select: (data) => data.data.data,
  });
};

export const useGetWeeklyActivity = (weeks = 4) => {
  return useQuery({
    queryKey: ['weekly-activity', weeks],
    queryFn: () => analyticsAPI.getWeeklyActivity(weeks),
    select: (data) => data.data.data,
  });
};

export const useGetMonthlyActivity = (months = 6) => {
  return useQuery({
    queryKey: ['monthly-activity', months],
    queryFn: () => analyticsAPI.getMonthlyActivity(months),
    select: (data) => data.data.data,
  });
};

export const useGetActivityHistory = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ['activity-history', page, limit],
    queryFn: () => analyticsAPI.getActivityHistory(page, limit),
    select: (data) => data.data,
  });
};

export const useGetMentorDashboard = () => {
  return useQuery({
    queryKey: ['mentor-dashboard'],
    queryFn: () => analyticsAPI.getMentorDashboard(),
    select: (data) => data.data.data,
  });
};

// Recommendations Hooks
export const useGetRecommendations = (page = 1, limit = 5) => {
  return useQuery({
    queryKey: ['recommendations', page, limit],
    queryFn: () => recommendationsAPI.getRecommendations(page, limit),
    select: (data) => data.data,
  });
};

export const useGetNextRecommendedLesson = () => {
  return useQuery({
    queryKey: ['next-recommendation'],
    queryFn: () => recommendationsAPI.getNextRecommendedLesson(),
    select: (data) => data.data.data,
  });
};

export const useGenerateRecommendations = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => recommendationsAPI.generateRecommendations(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
      queryClient.invalidateQueries({ queryKey: ['next-recommendation'] });
    },
  });
};

export const useMarkRecommendationAsViewed = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recommendationId) => recommendationsAPI.markAsViewed(recommendationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recommendations'] });
    },
  });
};
