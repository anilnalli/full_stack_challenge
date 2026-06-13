import { getPrisma } from '../config/database.js';
import { NotFoundError } from '../errors/AppError.js';

/**
 * User Repository
 * Data access layer for User operations
 */

export class UserRepository {
  constructor() {
    this.prisma = getPrisma();
  }

  async create(data) {
    return this.prisma.user.create({
      data,
      include: {
        studentProfile: true,
        mentorProfile: true,
      },
    });
  }

  async findById(id) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        studentProfile: true,
        mentorProfile: true,
      },
    });
  }

  async findByEmail(email) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        studentProfile: true,
        mentorProfile: true,
      },
    });
  }

  async update(id, data) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        studentProfile: true,
        mentorProfile: true,
      },
    });
  }

  async delete(id) {
    return this.prisma.user.delete({
      where: { id },
    });
  }

  async findAll(filters = {}, skip = 0, take = 10) {
    const where = {};
    if (filters.role) {
      where.role = filters.role;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        include: {
          studentProfile: true,
          mentorProfile: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { users, total };
  }
}

/**
 * Course Repository
 */
export class CourseRepository {
  constructor() {
    this.prisma = getPrisma();
  }

  async create(data) {
    return this.prisma.course.create({
      data,
      include: {
        sections: {
          include: {
            lessons: true,
          },
        },
      },
    });
  }

  async findById(id) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      throw new NotFoundError('Course', id);
    }

    return course;
  }

  async findAll(skip = 0, take = 10) {
    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        skip,
        take,
        include: {
          sections: true,
          enrollments: true,
        },
      }),
      this.prisma.course.count(),
    ]);

    return { courses, total };
  }

  async update(id, data) {
    return this.prisma.course.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return this.prisma.course.delete({
      where: { id },
    });
  }
}

/**
 * Enrollment Repository
 */
export class EnrollmentRepository {
  constructor() {
    this.prisma = getPrisma();
  }

  async create(data) {
    return this.prisma.enrollment.create({
      data,
      include: {
        course: {
          include: {
            sections: {
              include: {
                lessons: true,
              },
            },
          },
        },
        lessonProgress: true,
      },
    });
  }

  async findById(id) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { id },
      include: {
        course: {
          include: {
            sections: {
              include: {
                lessons: true,
              },
            },
          },
        },
        lessonProgress: true,
      },
    });

    if (!enrollment) {
      throw new NotFoundError('Enrollment', id);
    }

    return enrollment;
  }

  async findByStudentAndCourse(studentId, courseId) {
    return this.prisma.enrollment.findUnique({
      where: {
        studentId_courseId: { studentId, courseId },
      },
    });
  }

  async findByStudent(studentId, skip = 0, take = 10) {
    const [enrollments, total] = await Promise.all([
      this.prisma.enrollment.findMany({
        where: { studentId },
        skip,
        take,
        include: {
          course: {
            include: {
              sections: {
                include: {
                  lessons: true,
                },
              },
            },
          },
          lessonProgress: true,
        },
      }),
      this.prisma.enrollment.count({
        where: { studentId },
      }),
    ]);

    return { enrollments, total };
  }

  async update(id, data) {
    return this.prisma.enrollment.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return this.prisma.enrollment.delete({
      where: { id },
    });
  }
}

/**
 * Activity Repository
 */
export class ActivityRepository {
  constructor() {
    this.prisma = getPrisma();
  }

  async create(data) {
    return this.prisma.activity.create({
      data,
    });
  }

  async findByUser(userId, skip = 0, take = 10) {
    const [activities, total] = await Promise.all([
      this.prisma.activity.findMany({
        where: { userId },
        skip,
        take,
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.activity.count({
        where: { userId },
      }),
    ]);

    return { activities, total };
  }

  async findByTypeAndUser(userId, type, startDate, endDate) {
    return this.prisma.activity.findMany({
      where: {
        userId,
        type,
        timestamp: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { timestamp: 'asc' },
    });
  }

  async findByCourseAndUser(userId, courseId, skip = 0, take = 10) {
    const [activities, total] = await Promise.all([
      this.prisma.activity.findMany({
        where: { userId, courseId },
        skip,
        take,
        orderBy: { timestamp: 'desc' },
      }),
      this.prisma.activity.count({
        where: { userId, courseId },
      }),
    ]);

    return { activities, total };
  }
}

/**
 * Lesson Progress Repository
 */
export class LessonProgressRepository {
  constructor() {
    this.prisma = getPrisma();
  }

  async create(data) {
    return this.prisma.lessonProgress.create({
      data,
      include: {
        lesson: true,
      },
    });
  }

  async findById(id) {
    const progress = await this.prisma.lessonProgress.findUnique({
      where: { id },
      include: {
        lesson: true,
      },
    });

    if (!progress) {
      throw new NotFoundError('Lesson Progress', id);
    }

    return progress;
  }

  async findByEnrollmentAndLesson(enrollmentId, lessonId) {
    return this.prisma.lessonProgress.findUnique({
      where: {
        enrollmentId_lessonId: { enrollmentId, lessonId },
      },
    });
  }

  async findByEnrollment(enrollmentId) {
    return this.prisma.lessonProgress.findMany({
      where: { enrollmentId },
      include: {
        lesson: true,
      },
    });
  }

  async update(id, data) {
    return this.prisma.lessonProgress.update({
      where: { id },
      data,
    });
  }
}

/**
 * Student Recommendation Repository
 */
export class RecommendationRepository {
  constructor() {
    this.prisma = getPrisma();
  }

  async findByStudent(studentId, skip = 0, take = 10) {
    const [recommendations, total] = await Promise.all([
      this.prisma.studentRecommendation.findMany({
        where: { studentId },
        skip,
        take,
        orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.studentRecommendation.count({
        where: { studentId },
      }),
    ]);

    return { recommendations, total };
  }

  async createOrUpdate(studentId, lessonId, reason, priority = 0) {
    return this.prisma.studentRecommendation.upsert({
      where: {
        studentId_lessonId: { studentId, lessonId },
      },
      update: {
        reason,
        priority,
      },
      create: {
        studentId,
        lessonId,
        reason,
        priority,
      },
    });
  }

  async markAsViewed(recommendationId) {
    return this.prisma.studentRecommendation.update({
      where: { id: recommendationId },
      data: { viewedAt: new Date() },
    });
  }
}
