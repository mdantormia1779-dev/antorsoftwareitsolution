import express from 'express';
import { 
  getUserNotifications, 
  createNotification, 
  updateNotification, 
  deleteNotification 
} from './notification.controller.js';

// আপনার ফোল্ডার বা ফাইলের নাম যদি ভিন্ন হয়, তবে নিচের লাইনটি ঠিক করে নিন:
import { verifyAuth } from '../../middlewares/auth.middleware.js'; 
// অথবা যদি middleware (singular) হয়:
// import { verifyAuth } from '../../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyAuth, getUserNotifications);
router.post('/', verifyAuth, createNotification);
router.put('/:id', verifyAuth, updateNotification);
router.delete('/:id', verifyAuth, deleteNotification);

export default router;