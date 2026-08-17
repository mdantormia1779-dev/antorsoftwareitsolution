import { Router } from 'express';
import { 
  login, 
  logout, 
  forgotPassword, 
  resetPassword, 
  signup // 🔴 এখানে অবশ্যই signup ইম্পোর্ট থাকতে হবে
} from './auth.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/signup', signup); // এখন এটি কাজ করবে
router.post('/login', login);
router.post('/logout', verifyAuth, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;