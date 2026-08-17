import { Router } from 'express';
import { 
  createBranch, 
  getAllBranches, 
  getBranchById, 
  updateBranch, 
  deleteBranch 
} from './branch.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// All branch routes require authentication
router.use(verifyAuth);

router.get('/', getAllBranches);
router.get('/:id', getBranchById);

// Administrative operations restricted to SUPER_ADMIN and ADMIN
router.post('/', authorizeRoles('SUPER_ADMIN', 'ADMIN'), createBranch);
router.patch('/:id', authorizeRoles('SUPER_ADMIN', 'ADMIN'), updateBranch);
router.delete('/:id', authorizeRoles('SUPER_ADMIN', 'ADMIN'), deleteBranch);

export default router;