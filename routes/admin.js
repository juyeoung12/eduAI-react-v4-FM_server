// server/routes/admin.js
import express from 'express';
import isAuth from './authMiddleware.js';
import isAdmin from '../middlewares/isAdmin.js';
import { getDashboardStats, getAllUsers } from '../controllers/adminController.js';

const router = express.Router();

router.use(isAuth, isAdmin); // 인증 + 관리자 권한 필수

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);

export default router;