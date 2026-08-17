import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';
import { ENV } from '../config/env.js';

export const verifyAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token missing or malformed' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify JWT
    const decoded = jwt.verify(token, ENV.JWT_SECRET);

    // Check if session exists in database and is not expired
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    });

    if (!session || session.expiresAt < new Date()) {
      return res.status(401).json({ 
        success: false, 
        message: 'Session expired or invalid. Please log in again.' 
      });
    }

    if (!session.user || session.user.status !== 'ACTIVE') {
      return res.status(403).json({ 
        success: false, 
        message: 'User account is inactive, suspended, or not found.' 
      });
    }

    // Attach user and token context to request
    req.user = session.user;
    req.token = token;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid token authentication failed', 
      error: error.message 
    });
  }
};