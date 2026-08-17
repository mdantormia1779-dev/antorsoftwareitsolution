import { Router } from 'express';
import { 
  upsertSalaryStructure, 
  getSalaryStructure, 
  generatePayroll, 
  getPayrolls, 
  updatePayrollStatus 
} from './payroll.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// All payroll routes require authentication
router.use(verifyAuth);

// Employee views
router.get('/my-salary', getSalaryStructure);
router.get('/my-payslips', getPayrolls);

// Administrative & Finance management routes
router.get('/salary-structure/:userId', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'FINANCE', 'MANAGER'), getSalaryStructure);
router.post('/salary-structure', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'FINANCE'), upsertSalaryStructure);
router.post('/generate', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'FINANCE'), generatePayroll);
router.get('/', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'FINANCE', 'MANAGER'), getPayrolls);
router.patch('/:id/status', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'FINANCE'), updatePayrollStatus);

export default router;