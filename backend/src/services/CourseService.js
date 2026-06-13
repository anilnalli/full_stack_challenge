import {
  CourseRepository,
  EnrollmentRepository,
  LessonProgressRepository,
} from '../repositories/index.js';
import { NotFoundError } from '../errors/AppError.js';
import { getPrisma } from '../config/database.js';

/**
 * Course Service
 * Handles course management and enrollment logic
 */
export class CourseService {
  constructor() {
    this.courseRepository = new CourseRepository();
    this.enrollmentRepository = new EnrollmentRepository();
    this.lessonProgressRepository = new LessonProgressRepository();
    this.prisma = getPrisma();
  }

  /**
   * Create a new course
   */
  async createCourse(title, description) {
    return this.courseRepository.create({
      title,
      description,
    });
  }

  /**
   * Get course by ID with all sections and lessons
   */
  async getCourseById(courseId) {
    return this.courseRepository.findById(courseId);
  }

  /**
   * Get all courses
   */
  async getAllCourses(skip = 0, take = 10) {
    return this.courseRepository.findAll(skip, take);
  }

  /**
   * Update course
   */
  async updateCourse(courseId, data) {
    const course = await this.courseRepository.findById(courseId);
    return this.courseRepository.update(courseId, data);
  }

  /**
   * Delete course
   */
  async deleteCourse(courseId) {
    const course = await this.courseRepository.findById(courseId);
    return this.courseRepository.delete(courseId);
  }

  /**
   * Create a section in a course
   */
  async createSection(courseId, title, order) {
    await this.courseRepository.findById(courseId); // Verify course exists

    return this.prisma.section.create({
      data: {
        courseId,
        title,
        order,
      },
    });
  }

  /**
   * Create a lesson in a section
   */
  async createLesson(sectionId, title, description, duration, order) {
    const section = await this.prisma.section.findUnique({
      where: { id: sectionId },
    });

    if (!section) {
      throw new NotFoundError('Section', sectionId);
    }

    return this.prisma.lesson.create({
      data: {
        sectionId,
        title,
        description,
        duration,
        order,
      },
    });
  }

  /**
   * Enroll student in a course
   */
  async enrollStudent(studentId, courseId) {
    const course = await this.courseRepository.findById(courseId);

    const existingEnrollment = await this.enrollmentRepository.findByStudentAndCourse(
      studentId,
      courseId
    );

    if (existingEnrollment) {
      return existingEnrollment;
    }

    // Calculate total lessons in course
    const totalLessons = course.sections.reduce(
      (sum, section) => sum + section.lessons.length,
      0
    );

    const enrollment = await this.enrollmentRepository.create({
      studentId,
      courseId,
    });

    // Create lesson progress entries for all lessons
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        await this.lessonProgressRepository.create({
          enrollmentId: enrollment.id,
          lessonId: lesson.id,
        });
      }
    }

    return enrollment;
  }

  /**
   * Get student's enrollments
   */
  async getStudentEnrollments(studentId, skip = 0, take = 10) {
    return this.enrollmentRepository.findByStudent(studentId, skip, take);
  }

  /**
   * Update lesson progress
   */
  async updateLessonProgress(progressId, status, timeSpent) {
    const progress = await this.lessonProgressRepository.findById(progressId);

    const updates = {};
    if (status) updates.status = status;
    if (timeSpent !== undefined) updates.timeSpent = timeSpent;

    if (status === 'IN_PROGRESS' && !progress.startedAt) {
      updates.startedAt = new Date();
    }

    if (status === 'COMPLETED' && !progress.completedAt) {
      updates.completedAt = new Date();
    }

    return this.lessonProgressRepository.update(progressId, updates);
  }
}
