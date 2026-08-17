import prisma from '../../config/prisma.js';

export const createShiftData = async (organizationId, data) => {
  const {
    name,
    type,
    startTime,
    endTime,
    breakMinutes,
    workingHours,
    lateAfterMinutes,
    overtimeAfterMinutes
  } = data;

  const shift = await prisma.shift.create({
    data: {
      organizationId,
      name,
      type: type || 'FIXED',
      startTime,
      endTime,
      breakMinutes: breakMinutes ? parseInt(breakMinutes) : 60,
      workingHours: workingHours ? parseFloat(workingHours) : 8,
      lateAfterMinutes: lateAfterMinutes ? parseInt(lateAfterMinutes) : 15,
      overtimeAfterMinutes: overtimeAfterMinutes ? parseInt(overtimeAfterMinutes) : 480
    }
  });

  return shift;
};

export const fetchShiftsByOrg = async (organizationId) => {
  return await prisma.shift.findMany({
    where: { organizationId },
    include: {
      _count: {
        select: { assignments: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateShiftData = async (shiftId, organizationId, updateData) => {
  const shift = await prisma.shift.findFirst({
    where: { id: shiftId, organizationId }
  });

  if (!shift) {
    const error = new Error('Shift not found or does not belong to this organization.');
    error.statusCode = 404;
    throw error;
  }

  return await prisma.shift.update({
    where: { id: shiftId },
    data: {
      ...updateData,
      ...(updateData.breakMinutes && { breakMinutes: parseInt(updateData.breakMinutes) }),
      ...(updateData.workingHours && { workingHours: parseFloat(updateData.workingHours) }),
      ...(updateData.lateAfterMinutes && { lateAfterMinutes: parseInt(updateData.lateAfterMinutes) }),
      ...(updateData.overtimeAfterMinutes && { overtimeAfterMinutes: parseInt(updateData.overtimeAfterMinutes) })
    }
  });
};

export const assignEmployeeShiftData = async (organizationId, data) => {
  const { userId, shiftId, effectiveFrom, effectiveTo } = data;

  // Verify shift belongs to the organization
  const shift = await prisma.shift.findFirst({
    where: { id: shiftId, organizationId }
  });

  if (!shift) {
    const error = new Error('Shift not found.');
    error.statusCode = 404;
    throw error;
  }

  // Verify user belongs to the organization
  const user = await prisma.user.findFirst({
    where: { id: userId, organizationId }
  });

  if (!user) {
    const error = new Error('Employee not found.');
    error.statusCode = 404;
    throw error;
  }

  const assignment = await prisma.employeeShift.create({
    data: {
      userId,
      shiftId,
      effectiveFrom: new Date(effectiveFrom),
      effectiveTo: effectiveTo ? new Date(effectiveTo) : null
    },
    include: {
      shift: true,
      user: { select: { id: true, fullName: true, employeeId: true } }
    }
  });

  return assignment;
};

export const fetchEmployeeShiftHistory = async (userId) => {
  return await prisma.employeeShift.findMany({
    where: { userId },
    include: { shift: true },
    orderBy: { effectiveFrom: 'desc' }
  });
};