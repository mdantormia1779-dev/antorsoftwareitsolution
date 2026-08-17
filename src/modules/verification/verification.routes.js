import { Router } from 'express';
import { 
  verifyGeo, 
  verifyFace, 
  getPendingQueue, 
  decideVerificationQueue 
} from './verification.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// All verification routes require authentication
router.use(verifyAuth);

// Employee mobile check actions
router.post('/geo', verifyGeo);
router.post('/face', verifyFace);

// Manager review queue endpoints
router.get('/queue/pending', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getPendingQueue);
router.patch('/queue/:id/decide', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), decideVerificationQueue);

export default router;