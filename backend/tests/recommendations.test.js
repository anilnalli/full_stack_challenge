import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { RecommendationService } from '../src/services/RecommendationService.js';
import { AuthService } from '../src/services/AuthService.js';
import { CourseService } from '../src/services/CourseService.js';
import { getPrisma, disconnectPrisma } from '../src/config/database.js';

describe('Recommendation Service', () => {
  let recommendationService;
  let authService;
  let courseService;
  let prisma;
  let studentId;

  before(async () => {
    recommendationService = new RecommendationService();
    authService = new AuthService();
    courseService = new CourseService();
    prisma = getPrisma();

    // Create student
    const student = await authService.register(
      `recommendation-test-${Date.now()}@example.com`,
      'password123',
      'Test',
      'Student',
      'STUDENT'
    );
    studentId = student.user.id;

    // Create course with lessons
    const course = await courseService.createCourse('Recommendation Test', 'Test');
    const section = await courseService.createSection(course.id, 'Section 1', 1);
    await courseService.createLesson(section.id, 'Lesson 1', 'Test', 30, 1);

    // Enroll student
    await courseService.enrollStudent(studentId, course.id);
  });

  after(async () => {
    await disconnectPrisma();
  });

  it('should generate recommendations', async () => {
    const recommendations = await recommendationService.generateRecommendations(studentId);

    assert.ok(recommendations);
    assert.ok('recommendations' in recommendations);
    assert.ok(Array.isArray(recommendations.recommendations));
  });

  it('should get recommendations', async () => {
    const { recommendations } = await recommendationService.getRecommendations(studentId);

    assert.ok(Array.isArray(recommendations));
  });

  it('should get next recommended lesson', async () => {
    const lesson = await recommendationService.getNextRecommendedLesson(studentId);

    if (lesson) {
      assert.ok(lesson.id);
      assert.ok(lesson.reason);
    }
  });
});
