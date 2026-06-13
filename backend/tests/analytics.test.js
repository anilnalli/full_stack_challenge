import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { AnalyticsService } from '../src/services/AnalyticsService.js';
import { AuthService } from '../src/services/AuthService.js';
import { CourseService } from '../src/services/CourseService.js';
import { getPrisma, disconnectPrisma } from '../src/config/database.js';

describe('Analytics Service', () => {
  let analyticsService;
  let authService;
  let courseService;
  let prisma;
  let studentId;
  let courseId;

  before(async () => {
    analyticsService = new AnalyticsService();
    authService = new AuthService();
    courseService = new CourseService();
    prisma = getPrisma();

    // Create student
    const student = await authService.register(
      `analytics-test-${Date.now()}@example.com`,
      'password123',
      'Test',
      'Student',
      'STUDENT'
    );
    studentId = student.user.id;

    // Create and enroll in course
    const course = await courseService.createCourse('Analytics Test', 'Test');
    courseId = course.id;
    await courseService.createSection(courseId, 'Section 1', 1);
  });

  after(async () => {
    await disconnectPrisma();
  });

  it('should get dashboard summary', async () => {
    const summary = await analyticsService.getStudentDashboardSummary(studentId);

    assert.ok(summary);
    assert.ok('totalCourses' in summary);
    assert.ok('totalLessons' in summary);
    assert.ok('completedLessons' in summary);
    assert.ok('completionPercent' in summary);
  });

  it('should get progress by course', async () => {
    const progress = await analyticsService.getProgressByCourse(studentId);

    assert.ok(Array.isArray(progress));
  });

  it('should get daily activity', async () => {
    const activity = await analyticsService.getDailyLearningActivity(studentId, 7);

    assert.ok(Array.isArray(activity));
  });

  it('should get time series data', async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date();

    const data = await analyticsService.getTimeSeriesData(
      studentId,
      startDate,
      endDate,
      'daily'
    );

    assert.ok(Array.isArray(data));
  });
});
