import { z } from 'zod';

/**
 * Validation schemas for frontend forms
 */

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  role: z.enum(['STUDENT', 'MENTOR'], { errorMap: () => ({ message: 'Invalid role' }) }),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const createCourseSchema = z.object({
  title: z.string().min(3, 'Course title must be at least 3 characters'),
  description: z.string().optional(),
});

export const createSectionSchema = z.object({
  title: z.string().min(3, 'Section title must be at least 3 characters'),
  order: z.number().min(1, 'Order must be a positive number'),
});

export const createLessonSchema = z.object({
  title: z.string().min(3, 'Lesson title must be at least 3 characters'),
  description: z.string().optional(),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  order: z.number().min(1, 'Order must be a positive number'),
});

export const updateLessonProgressSchema = z.object({
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']).optional(),
  timeSpent: z.number().min(0).optional(),
});
