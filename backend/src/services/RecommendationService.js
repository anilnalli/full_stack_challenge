import {
  RecommendationRepository,
  LessonProgressRepository,
} from '../repositories/index.js';
import { getPrisma } from '../config/database.js';
import { RECOMMENDATION_REASONS } from '../constants/index.js';

/**
 * Recommendation Service
 * Handles adaptive recommendation logic
 */
export class RecommendationService {
  constructor() {
    this.recommendationRepository = new RecommendationRepository();
    this.lessonProgressRepository = new LessonProgressRepository();
    this.prisma = getPrisma();
  }

  /**
   * Generate recommendations for a student
   */
  async generateRecommendations(studentId) {
    // Get student's enrollments
    const enrollments = await this.prisma.enrollment.findMany({
      where: { studentId },
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

    const recommendations = [];

    // Strategy 1: Find incomplete lessons in courses
    for (const enrollment of enrollments) {
      const incompleteLessons = enrollment.lessonProgress.filter(
        (p) => p.status !== 'COMPLETED'
      );

      if (incompleteLessons.length > 0) {
        const incompleteLesson = incompleteLessons[0];
        await this.recommendationRepository.createOrUpdate(
          studentId,
          incompleteLesson.lessonId,
          RECOMMENDATION_REASONS.INCOMPLETE_LESSON,
          3
        );
        recommendations.push(incompleteLesson.lessonId);
      }
    }

    // Strategy 2: Recommend from least completed course
    if (enrollments.length > 0) {
      const leastCompleted = enrollments.reduce((prev, current) => {
        const prevCompleted = prev.lessonProgress.filter(
          (p) => p.status === 'COMPLETED'
        ).length;
        const currentCompleted = current.lessonProgress.filter(
          (p) => p.status === 'COMPLETED'
        ).length;
        return currentCompleted < prevCompleted ? current : prev;
      });

      const nextLesson = leastCompleted.lessonProgress.find(
        (p) => p.status === 'NOT_STARTED'
      );

      if (nextLesson && !recommendations.includes(nextLesson.lessonId)) {
        await this.recommendationRepository.createOrUpdate(
          studentId,
          nextLesson.lessonId,
          RECOMMENDATION_REASONS.LEAST_COMPLETED_COURSE,
          2
        );
        recommendations.push(nextLesson.lessonId);
      }
    }

    // Strategy 3: Recommend from most recent course
    if (enrollments.length > 0) {
      const mostRecent = enrollments.sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      )[0];

      const nextLesson = mostRecent.lessonProgress.find(
        (p) => p.status === 'NOT_STARTED'
      );

      if (nextLesson && !recommendations.includes(nextLesson.lessonId)) {
        await this.recommendationRepository.createOrUpdate(
          studentId,
          nextLesson.lessonId,
          RECOMMENDATION_REASONS.MOST_RECENT_COURSE,
          1
        );
      }
    }

    return this.getRecommendations(studentId);
  }

  /**
   * Get recommendations for student
   */
  async getRecommendations(studentId, skip = 0, take = 5) {
    const { recommendations, total } = await this.recommendationRepository.findByStudent(
      studentId,
      skip,
      take
    );

    // Fetch lesson details
    const recommendationsWithDetails = await Promise.all(
      recommendations.map(async (rec) => {
        const lesson = await this.prisma.lesson.findUnique({
          where: { id: rec.lessonId },
          include: {
            section: {
              include: {
                course: true,
              },
            },
          },
        });

        return {
          id: rec.id,
          lessonId: rec.lessonId,
          lesson: lesson,
          reason: rec.reason,
          priority: rec.priority,
          createdAt: rec.createdAt,
          viewedAt: rec.viewedAt,
        };
      })
    );

    return { recommendations: recommendationsWithDetails, total };
  }

  /**
   * Mark recommendation as viewed
   */
  async markRecommationAsViewed(recommendationId) {
    return this.recommendationRepository.markAsViewed(recommendationId);
  }

  /**
   * Get next recommended lesson
   */
  async getNextRecommendedLesson(studentId) {
    const { recommendations } = await this.recommendationRepository.findByStudent(
      studentId,
      0,
      1
    );

    if (recommendations.length === 0) {
      return null;
    }

    const rec = recommendations[0];
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: rec.lessonId },
      include: {
        section: {
          include: {
            course: true,
          },
        },
      },
    });

    return {
      id: rec.id,
      lesson,
      reason: rec.reason,
    };
  }
}
