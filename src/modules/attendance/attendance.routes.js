import { Router } from 'express';
import { 
  checkIn, 
  checkOut, 
  getMyAttendance, 
  getOrganizationAttendance 
} from './attendance.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// All attendance routes require authentication
router.use(verifyAuth);

// Employee actions
router.post('/check-in', checkIn);
router.post('/check-out', checkOut);
router.get('/my-history', getMyAttendance);

// Management overview reports
router.get('/overview', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getOrganizationAttendance);

export default router;