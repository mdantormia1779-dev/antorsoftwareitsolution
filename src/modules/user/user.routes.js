import { Router } from 'express';
import { 
  createUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} from './user.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// All user routes require authentication
router.use(verifyAuth);

router.get('/', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getAllUsers);
router.get('/:id', getUserById);

// Administrative employee management actions
router.post('/', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), createUser);
router.patch('/:id', authorizeRoles('SUPER_ADMIN', 'ADMIN'), updateUser);
router.delete('/:id', authorizeRoles('SUPER_ADMIN', 'ADMIN'), deleteUser);

export default router;