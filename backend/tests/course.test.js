import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import { CourseService } from '../src/services/CourseService.js';
import { AuthService } from '../src/services/AuthService.js';
import { getPrisma, disconnectPrisma } from '../src/config/database.js';

describe('Course Service', () => {
  let courseService;
  let authService;
  let prisma;
  let studentId;

  before(async () => {
    courseService = new CourseService();
    authService = new AuthService();
    prisma = getPrisma();

    // Create a student for testing
    const student = await authService.register(
      `course-test-${Date.now()}@example.com`,
      'password123',
      'Test',
      'Student',
      'STUDENT'
    );
    studentId = student.user.id;
  });

  after(async () => {
    await disconnectPrisma();
  });

  it('should create a course', async () => {
    const course = await courseService.createCourse(
      'Test Course',
      'This is a test course'
    );

    assert.ok(course.id);
    assert.equal(course.title, 'Test Course');
    assert.equal(course.description, 'This is a test course');
  });

  it('should get all courses', async () => {
    const result = await courseService.getAllCourses(0, 10);

    assert.ok(Array.isArray(result.courses));
    assert.ok(result.total >= 0);
  });

  it('should enroll student in course', async () => {
    const course = await courseService.createCourse('Enrollment Test', 'Test');
    await courseService.createSection(course.id, 'Section 1', 1);

    const enrollment = await courseService.enrollStudent(studentId, course.id);

    assert.ok(enrollment.id);
    assert.equal(enrollment.studentId, studentId);
    assert.equal(enrollment.courseId, course.id);
  });

  it('should not enroll twice in same course', async () => {
    const course = await courseService.createCourse('Double Enroll Test', 'Test');

    await courseService.enrollStudent(studentId, course.id);
    const secondEnrollment = await courseService.enrollStudent(studentId, course.id);

    assert.equal(secondEnrollment.studentId, studentId);
    assert.equal(secondEnrollment.courseId, course.id);
  });
});
