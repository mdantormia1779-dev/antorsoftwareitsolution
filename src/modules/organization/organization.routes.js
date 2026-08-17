import { Router } from 'express';
import { 
  createOrganization, 
  getAllOrganizations, // ১. ফাংশনটি ইম্পোর্ট করুন
  getOrganizationDetails, 
  updateOrganization, 
  getDashboardAnalytics,
  deleteOrganization 
} from './organization.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';
import { authorizeRoles } from '../../middlewares/rbac.middleware.js';

const router = Router();

// ২. ফ্রন্টএন্ডের জন্য সব অর্গানাইজেশন ফেচ করার এই গেট রাউটটি যোগ করুন
router.get('/', verifyAuth, getAllOrganizations);

// অর্গানাইজেশন তৈরি (POST)
router.post('/', createOrganization);

// Protected routes below
router.use(verifyAuth);

router.get('/profile', getOrganizationDetails);
router.patch('/profile/:id', authorizeRoles('SUPER_ADMIN', 'ADMIN'), updateOrganization);
router.delete('/:id', verifyAuth, authorizeRoles('SUPER_ADMIN', 'ADMIN'), deleteOrganization);
router.get('/analytics', authorizeRoles('SUPER_ADMIN', 'ADMIN', 'MANAGER'), getDashboardAnalytics);

export default router;