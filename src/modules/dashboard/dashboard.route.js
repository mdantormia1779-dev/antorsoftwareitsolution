import { Router } from 'express';
import { 
  getDashboardStats, 
  getWeeklyAttendance, 
  getRecentActivities,
  getMonthlyWorkingHours 
} from './dashboard.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.use(verifyAuth);

router.get('/stats', getDashboardStats);
router.get('/weekly-attendance', getWeeklyAttendance); 
router.get('/activities', getRecentActivities);         
router.get('/monthly-hours', getMonthlyWorkingHours); // নতুন যুক্ত করা হলো

export default router;