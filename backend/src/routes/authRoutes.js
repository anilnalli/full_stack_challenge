import { Router } from 'express';
import {
  register,
  login,
  getCurrentUser,
  logout,
} from '../controllers/authController.js';
import {
  validateRegister,
  validateLogin,
} from '../validators/index.js';
import { handleValidationErrors } from '../middleware/validation.js';
import { authenticate } from '../middleware/auth.js';

const router = Router();

/**
 * Auth Routes
 */

// POST /api/auth/register
router.post('/register', validateRegister, handleValidationErrors, register);

// POST /api/auth/login
router.post('/login', validateLogin, handleValidationErrors, login);

// GET /api/auth/me
router.get('/me', authenticate, getCurrentUser);

// POST /api/auth/logout
router.post('/logout', authenticate, logout);

export default router;
