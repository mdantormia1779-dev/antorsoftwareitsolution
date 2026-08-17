import { Router } from 'express';
import { 
  login, 
  logout, 
  forgotPassword, 
  resetPassword, 
  signup,
  updateProfile
} from './auth.controller.js';
import { verifyAuth } from '../../middlewares/auth.middleware.js';

const router = Router();

router.post('/signup', signup); // এখন এটি কাজ করবে
router.post('/login', login);
router.post('/logout', verifyAuth, logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.put('/update', verifyAuth, updateProfile);

export default router;