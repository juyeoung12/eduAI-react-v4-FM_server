//server\routes\auth.js
import express from 'express';
import {
  register,
  loginUser,
  logout,
  getMe,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', loginUser);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;