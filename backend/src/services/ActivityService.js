import { ActivityRepository } from '../repositories/index.js';
import { getPrisma } from '../config/database.js';

/**
 * Activity Service
 * Handles activity tracking
 */
export class ActivityService {
  constructor() {
    this.activityRepository = new ActivityRepository();
    this.prisma = getPrisma();
  }

  /**
   * Log an activity
   */
  async logActivity(userId, type, courseId = null, lessonId = null, metadata = null) {
    return this.activityRepository.create({
      userId,
      type,
      courseId,
      lessonId,
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
  }

  /**
   * Get user activity history
   */
  async getUserActivityHistory(userId, skip = 0, take = 10) {
    return this.activityRepository.findByUser(userId, skip, take);
  }

  /**
   * Get course activity
   */
  async getCourseActivity(userId, courseId, skip = 0, take = 10) {
    return this.activityRepository.findByCourseAndUser(userId, courseId, skip, take);
  }

  /**
   * Export activity history as CSV
   */
  async exportActivityHistoryAsCSV(userId) {
    const { activities } = await this.activityRepository.findByUser(userId, 0, 10000);

    // Create CSV header
    let csv = 'Timestamp,Activity Type,Course,Lesson\n';

    // Add rows
    for (const activity of activities) {
      const timestamp = new Date(activity.timestamp).toISOString();
      const type = activity.type;
      const course = activity.course ? activity.course.title : 'N/A';
      const lesson = activity.lesson ? activity.lesson.title : 'N/A';

      csv += `"${timestamp}","${type}","${course}","${lesson}"\n`;
    }

    return csv;
  }
}
