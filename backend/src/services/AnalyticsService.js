import { ActivityRepository } from '../repositories/index.js';
import { getPrisma } from '../config/database.js';

/**
 * Analytics Service
 * Handles all analytics and recommendation logic
 */
export class AnalyticsService {
  constructor() {
    this.activityRepository = new ActivityRepository();
    this.prisma = getPrisma();
  }

  /**
   * Get dashboard summary for a student
   */
  async getStudentDashboardSummary(studentId) {
    // Get student profile
    const student = await this.prisma.studentProfile.findUnique({
      where: { userId: studentId },
      include: {
        enrollments: {
          include: {
            course: true,
            lessonProgress: true,
          },
        },
      },
    });

    const enrollments = student.enrollments;
    const totalCourses = enrollments.length;

    // Calculate completion metrics
    let totalLessons = 0;
    let completedLessons = 0;
    let totalTimeSpent = 0;

    enrollments.forEach((enrollment) => {
      totalTimeSpent += enrollment.totalTimeSpent;
      enrollment.lessonProgress.forEach((progress) => {
        totalLessons++;
        if (progress.status === 'COMPLETED') {
          completedLessons++;
        }
      });
    });

    const completionPercent =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      totalCourses,
      totalLessons,
      completedLessons,
      pendingLessons: totalLessons - completedLessons,
      totalStudyTime: totalTimeSpent, // in minutes
      averageDailyStudyTime: await this.calculateAverageDailyStudyTime(studentId),
      completionPercent,
      currentStreak: student.currentStreak,
      recentActivity: await this.getRecentActivity(studentId, 5),
    };
  }

  /**
   * Get progress by course
   */
  async getProgressByCourse(studentId, skip = 0, take = 10) {
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId },
      skip,
      take,
      include: {
        course: true,
        lessonProgress: true,
      },
    });

    return enrollments.map((enrollment) => ({
      courseId: enrollment.course.id,
      courseTitle: enrollment.course.title,
      status: enrollment.status,
      totalLessons: enrollment.lessonProgress.length,
      completedLessons: enrollment.lessonProgress.filter(
        (p) => p.status === 'COMPLETED'
      ).length,
      timeSpent: enrollment.totalTimeSpent,
      completionPercent: Math.round(
        (enrollment.lessonProgress.filter((p) => p.status === 'COMPLETED').length /
          enrollment.lessonProgress.length) *
          100
      ),
      enrolledAt: enrollment.enrolledAt,
      completedAt: enrollment.completedAt,
    }));
  }

  /**
   * Get time series data for a date range
   */
  async getTimeSeriesData(studentId, startDate, endDate, groupBy = 'daily') {
    const activities = await this.activityRepository.findByTypeAndUser(
      studentId,
      'LESSON_COMPLETED',
      startDate,
      endDate
    );

    // Group activities by date
    const grouped = {};

    activities.forEach((activity) => {
      const date = new Date(activity.timestamp);
      let key;

      if (groupBy === 'daily') {
        key = date.toISOString().split('T')[0];
      } else if (groupBy === 'weekly') {
        const year = date.getFullYear();
        const week = Math.ceil((date.getDate() + new Date(year, date.getMonth(), 1).getDay()) / 7);
        key = `${year}-W${week}`;
      } else if (groupBy === 'monthly') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      grouped[key] = (grouped[key] || 0) + 1;
    });

    return Object.entries(grouped).map(([date, count]) => ({
      date,
      value: count,
    }));
  }

  /**
   * Get daily learning activity
   */
  async getDailyLearningActivity(studentId, days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.getTimeSeriesData(studentId, startDate, new Date(), 'daily');
  }

  /**
   * Get weekly learning activity
   */
  async getWeeklyLearningActivity(studentId, weeks = 4) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - weeks * 7);

    return this.getTimeSeriesData(studentId, startDate, new Date(), 'weekly');
  }

  /**
   * Get monthly learning activity
   */
  async getMonthlyLearningActivity(studentId, months = 6) {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    return this.getTimeSeriesData(studentId, startDate, new Date(), 'monthly');
  }

  /**
   * Get activity history
   */
  async getActivityHistory(studentId, skip = 0, take = 10) {
    return this.activityRepository.findByUser(studentId, skip, take);
  }

  /**
   * Get mentor overview dashboard
   */
  async getMentorDashboardOverview(mentorId) {
    // Get all students assigned to this mentor
    const mentorProfile = await this.prisma.mentorProfile.findUnique({
      where: { userId: mentorId },
      include: {
        mentorStudents: true,
      },
    });

    if (!mentorProfile) {
      return null;
    }

    const studentIds = mentorProfile.mentorStudents.map((ms) => ms.studentId);

    // Get students' profiles and enrollments
    const studentProfiles = await this.prisma.studentProfile.findMany({
      where: {
        id: { in: studentIds },
      },
      include: {
        enrollments: {
          include: {
            lessonProgress: true,
          },
        },
      },
    });

    const totalStudents = studentProfiles.length;

    // Calculate metrics
    let totalEnrollments = 0;
    let completedEnrollments = 0;
    let studentsAtRisk = 0;
    let topPerformers = 0;

    const studentMetrics = studentProfiles.map((student) => {
      const enrollments = student.enrollments;
      totalEnrollments += enrollments.length;

      let completedCount = 0;
      let completionPercent = 0;

      enrollments.forEach((enrollment) => {
        if (enrollment.status === 'COMPLETED') {
          completedCount++;
          completedEnrollments++;
        }

        const completed = enrollment.lessonProgress.filter(
          (p) => p.status === 'COMPLETED'
        ).length;
        completionPercent += (completed / enrollment.lessonProgress.length) * 100;
      });

      const avgCompletion = enrollments.length
        ? Math.round(completionPercent / enrollments.length)
        : 0;

      if (avgCompletion < 30) studentsAtRisk++;
      if (avgCompletion >= 80) topPerformers++;

      return {
        studentId: student.userId,
        enrolledCourses: enrollments.length,
        completedCourses: completedCount,
        averageCompletion: avgCompletion,
      };
    });

    return {
      totalStudents,
      totalEnrollments,
      completedEnrollments,
      studentsAtRisk,
      topPerformers,
      averageCompletion: totalEnrollments
        ? Math.round(
            (completedEnrollments / totalEnrollments) * 100 +
              studentMetrics.reduce((sum, m) => sum + m.averageCompletion, 0) /
                totalStudents
          )
        : 0,
      studentMetrics,
    };
  }

  /**
   * Calculate average daily study time
   */
  async calculateAverageDailyStudyTime(studentId) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const enrollments = await this.prisma.enrollment.findMany({
      where: {
        studentId,
        updatedAt: {
          gte: sevenDaysAgo,
        },
      },
    });

    const totalTime = enrollments.reduce((sum, e) => sum + e.totalTimeSpent, 0);

    return Math.round(totalTime / 7);
  }

  /**
   * Get recent activity
   */
  async getRecentActivity(studentId, limit = 5) {
    const activities = await this.prisma.activity.findMany({
      where: { userId: studentId },
      take: limit,
      orderBy: { timestamp: 'desc' },
      include: {
        lesson: true,
        course: true,
      },
    });

    return activities;
  }
}
