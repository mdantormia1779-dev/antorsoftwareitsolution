import prisma from '../../config/prisma.js';

export const processCheckIn = async ({ userId, branchId, checkInFaceVerificationId, checkInGeoVerificationId }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if attendance for today already exists
  const existingAttendance = await prisma.attendance.findUnique({
    where: {
      userId_workDate: {
        userId,
        workDate: today
      }
    }
  });

  if (existingAttendance && existingAttendance.checkIn) {
    const error = new Error('You have already checked in for today.');
    error.statusCode = 400;
    throw error;
  }

  // Fetch employee active shift to calculate late status (Default standard: 9:00 AM start, 15 mins grace period)
  const now = new Date();
  const shiftHour = 9; 
  const shiftMinute = 0;
  const gracePeriodMinutes = 15;

  const checkInTimeMinutes = now.getHours() * 60 + now.getMinutes();
  const shiftStartMinutes = shiftHour * 60 + shiftMinute;
  const lateThreshold = shiftStartMinutes + gracePeriodMinutes;

  const isLate = checkInTimeMinutes > lateThreshold;
  const lateMinutes = isLate ? checkInTimeMinutes - shiftStartMinutes : 0;

  const attendanceData = {
    userId,
    branchId,
    workDate: today,
    checkIn: now,
    isLate,
    lateMinutes,
    status: isLate ? 'LATE' : 'PRESENT',
    ...(checkInFaceVerificationId && { checkInFaceVerificationId }),
    ...(checkInGeoVerificationId && { checkInGeoVerificationId })
  };

  if (existingAttendance) {
    return await prisma.attendance.update({
      where: { id: existingAttendance.id },
      data: attendanceData,
      include: { branch: true }
    });
  }

  return await prisma.attendance.create({
    data: attendanceData,
    include: { branch: true }
  });
};

export const processCheckOut = async ({ userId, checkOutFaceVerificationId, checkOutGeoVerificationId }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const attendance = await prisma.attendance.findUnique({
    where: {
      userId_workDate: {
        userId,
        workDate: today
      }
    }
  });

  if (!attendance || !attendance.checkIn) {
    const error = new Error('No active check-in record found for today.');
    error.statusCode = 400;
    throw error;
  }

  if (attendance.checkOut) {
    const error = new Error('You have already checked out for today.');
    error.statusCode = 400;
    throw error;
  }

  const checkOutTime = new Date();
  const diffMs = checkOutTime - new Date(attendance.checkIn);
  const totalWorkingMinutes = Math.floor(diffMs / (1000 * 60));
  
  // Calculate overtime if working minutes exceed standard 8 hours (480 minutes)
  const standardWorkMinutes = 480;
  const overtimeMinutes = totalWorkingMinutes > standardWorkMinutes ? totalWorkingMinutes - standardWorkMinutes : 0;

  const updatedAttendance = await prisma.attendance.update({
    where: { id: attendance.id },
    data: {
      checkOut: checkOutTime,
      workingMinutes: totalWorkingMinutes,
      overtimeMinutes,
      ...(checkOutFaceVerificationId && { checkOutFaceVerificationId }),
      ...(checkOutGeoVerificationId && { checkOutGeoVerificationId })
    },
    include: { branch: true }
  });

  return updatedAttendance;
};

export const fetchUserAttendanceHistory = async (userId, queryParams) => {
  const { startDate, endDate } = queryParams;

  return await prisma.attendance.findMany({
    where: {
      userId,
      ...(startDate && endDate && {
        workDate: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    },
    include: { branch: true },
    orderBy: { workDate: 'desc' }
  });
};

export const fetchOrgAttendanceOverview = async (organizationId, queryParams) => {
  const { date, branchId } = queryParams;
  const targetDate = date ? new Date(date) : new Date();
  targetDate.setHours(0, 0, 0, 0);

  return await prisma.attendance.findMany({
    where: {
      workDate: targetDate,
      branch: {
        organizationId,
        ...(branchId && { id: branchId })
      }
    },
    include: {
      user: {
        select: { id: true, fullName: true, employeeId: true, department: { select: { name: true } } }
      },
      branch: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};