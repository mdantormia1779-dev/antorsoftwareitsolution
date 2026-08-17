export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Prisma Unique Constraint Violations (e.g., duplicate email/employee ID)
  if (err.code === 'P2002') {
    statusCode = 409;
    const targetField = err.meta?.target ? err.meta.target.join(', ') : 'field';
    message = `Duplicate entry error: A record with this ${targetField} already exists.`;
  } 
  
  // Handle Prisma Record Not Found
  else if (err.code === 'P2025') {
    statusCode = 404;
    message = 'Requested record not found in the database.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};