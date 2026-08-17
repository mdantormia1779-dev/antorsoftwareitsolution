import { Router } from 'express';
import { 
  getAttendanceReport, 
  getPayrollReport, 
  getLeaveReport, 
  getHeadcountReport 
} from './report.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// All report routes require authentication and high-level privileges
router.use(verifyAuth);
router.use(authorizeRoles('SUPER_ADMIN', 'ADMIN', 'FINANCE', 'MANAGER'));

router.get('/attendance', getAttendanceReport);
router.get('/payroll', getPayrollReport);
router.get('/leave', getLeaveReport);
router.get('/headcount', getHeadcountReport);

export default router;