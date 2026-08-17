import { Router } from 'express';
import { 
  createShift, 
  getAllShifts, 
  updateShift, 
  assignShiftToEmployee, 
  getMyShiftHistory 
} from './shift.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// All shift routes require authentication
router.use(verifyAuth);

// Employee shift view
router.get('/my-shifts', getMyShiftHistory);

// Management shift configurations
router.get('/', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getAllShifts);
router.post('/', authorizeRoles('SUPER_ADMIN', 'ADMIN'), createShift);
router.patch('/:id', authorizeRoles('SUPER_ADMIN', 'ADMIN'), updateShift);
router.post('/assign', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), assignShiftToEmployee);

export default router;