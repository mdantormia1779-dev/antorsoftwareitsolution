import { Router } from 'express';
import { 
  createReview, 
  getReviews, 
  updateReview, 
  createKpi, 
  getMyKpis 
} from './performance.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// All performance routes require authentication
router.use(verifyAuth);

// Employee KPI & Review views (Separated to avoid path-to-regexp error)
router.get('/kpis', getMyKpis);
router.get('/kpis/:userId', getMyKpis);

// Manager & Admin performance appraisal routes
router.get('/reviews', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getReviews);
router.post('/reviews', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), createReview);
router.patch('/reviews/:id', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), updateReview);
router.post('/kpis', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), createKpi);

export default router;