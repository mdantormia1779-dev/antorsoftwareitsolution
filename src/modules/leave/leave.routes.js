import { Router } from 'express';
import { 
  createLeavePolicy, 
  getLeavePolicies, 
  getMyLeaveBalances, 
  applyForLeave, 
  getLeaveRequests, 
  decideLeaveRequest 
} from './leave.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// All leave routes require authentication
router.use(verifyAuth);

// Employee leave actions & balances
router.get('/balances', getMyLeaveBalances);
router.post('/apply', applyForLeave);

// Leave policies management (Admin)
router.get('/policies', getLeavePolicies);
router.post('/policies', authorizeRoles('SUPER_ADMIN', 'ADMIN'), createLeavePolicy);

// Manager review workflows
router.get('/requests', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getLeaveRequests);
router.patch('/requests/:id/decide', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), decideLeaveRequest);

export default router;