import { CourseService } from '../services/CourseService.js';
import { ActivityService } from '../services/ActivityService.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/responseHelper.js';
import { getPaginationParams, getPaginationMeta } from '../utils/pagination.js';
import { HTTP_STATUS, ACTIVITY_TYPES } from '../constants/index.js';

const courseService = new CourseService();
const activityService = new ActivityService();

/**
 * Create Course Controller
 */
export const createCourse = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  const course = await courseService.createCourse(title, description);

  sendSuccess(res, HTTP_STATUS.CREATED, 'Course created successfully', course);
});

/**
 * Get All Courses Controller
 */
export const getAllCourses = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPaginationParams(req.query);

  const { courses, total } = await courseService.getAllCourses(skip, limit);

  sendSuccess(res, HTTP_STATUS.OK, 'Courses retrieved successfully', courses, {
    ...getPaginationMeta(page, limit, total),
  });
});

/**
 * Get Course by ID Controller
 */
export const getCourseById = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await courseService.getCourseById(courseId);

  sendSuccess(res, HTTP_STATUS.OK, 'Course retrieved successfully', course);
});

/**
 * Update Course Controller
 */
export const updateCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const data = req.body;

  const course = await courseService.updateCourse(courseId, data);

  sendSuccess(res, HTTP_STATUS.OK, 'Course updated successfully', course);
});

/**
 * Delete Course Controller
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  await courseService.deleteCourse(courseId);

  sendSuccess(res, HTTP_STATUS.OK, 'Course deleted successfully');
});

/**
 * Create Section Controller
 */
export const createSection = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, order } = req.body;

  const section = await courseService.createSection(courseId, title, order);

  sendSuccess(res, HTTP_STATUS.CREATED, 'Section created successfully', section);
});

/**
 * Create Lesson Controller
 */
export const createLesson = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;
  const { title, description, duration, order } = req.body;

  const lesson = await courseService.createLesson(
    sectionId,
    title,
    description,
    duration,
    order
  );

  sendSuccess(res, HTTP_STATUS.CREATED, 'Lesson created successfully', lesson);
});

/**
 * Enroll in Course Controller
 */
export const enrollCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user.id;

  const enrollment = await courseService.enrollStudent(studentId, courseId);

  // Log activity
  await activityService.logActivity(studentId, ACTIVITY_TYPES.COURSE_STARTED, courseId);

  sendSuccess(res, HTTP_STATUS.CREATED, 'Enrolled in course successfully', enrollment);
});

/**
 * Get Student Enrollments Controller
 */
export const getStudentEnrollments = asyncHandler(async (req, res) => {
  const { skip, limit, page } = getPaginationParams(req.query);
  const studentId = req.user.id;

  const { enrollments, total } = await courseService.getStudentEnrollments(
    studentId,
    skip,
    limit
  );

  sendSuccess(res, HTTP_STATUS.OK, 'Enrollments retrieved successfully', enrollments, {
    ...getPaginationMeta(page, limit, total),
  });
});

/**
 * Update Lesson Progress Controller
 */
export const updateLessonProgress = asyncHandler(async (req, res) => {
  const { progressId } = req.params;
  const { status, timeSpent } = req.body;
  const userId = req.user.id;

  const progress = await courseService.updateLessonProgress(progressId, status, timeSpent);

  // Log activity
  if (status === 'COMPLETED') {
    await activityService.logActivity(userId, 'LESSON_COMPLETED', null, progress.lessonId);
  } else if (status === 'IN_PROGRESS') {
    await activityService.logActivity(userId, 'LESSON_STARTED', null, progress.lessonId);
  }

  sendSuccess(res, HTTP_STATUS.OK, 'Lesson progress updated successfully', progress);
});
