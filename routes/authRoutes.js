import express from 'express';
import {
  registerUser,
  loginUser,
  googleAuth,
  getMe,
  registerAdmin,
  loginAdmin,
  getAdminMe
} from '../controllers/authController.js';
import { protect, protectAdmin } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleAuth);
router.get('/me', protect, getMe);

// Admin routes
router.post('/admin/register', registerAdmin);
router.post('/admin/login', loginAdmin);
router.get('/admin/me', protectAdmin, getAdminMe);

export default router;
