import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

// Import Routes
import authRoutes from './modules/auth/auth.routes.js';
import organizationRoutes from './modules/organization/organization.routes.js';
import branchRoutes from './modules/branch/branch.routes.js';
import userRoutes from './modules/user/user.routes.js';
import attendanceRoutes from './modules/attendance/attendance.routes.js';
import verificationRoutes from './modules/verification/verification.routes.js';
import leaveRoutes from './modules/leave/leave.routes.js';
import shiftRoutes from './modules/shift/shift.routes.js';
import payrollRoutes from './modules/payroll/payroll.routes.js';
import performanceRoutes from './modules/performance/performance.routes.js';
import reportRoutes from './modules/report/report.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.route.js';
import notificationRoutes from './modules/notification/notification.routes.js';

// Import Logger
import { logger } from './utils/logger.js';

const app = express();

// Security & Utility Middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'HR & Attendance API Server is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// API Routes Mounting
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/branches', branchRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/verification', verificationRoutes);
app.use('/api/v1/leave', leaveRoutes);
app.use('/api/v1/shifts', shiftRoutes);
app.use('/api/v1/payroll', payrollRoutes);
app.use('/api/v1/performance', performanceRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// 404 Route Handler
app.use((req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  if (process.env.NODE_ENV === 'development' && statusCode === 500) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

export default app;