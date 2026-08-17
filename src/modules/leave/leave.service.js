import prisma from '../../config/prisma.js';

export const createLeavePolicyData = async (organizationId, data) => {
  const { leaveType, allowedDays, carryForward } = data;

  const policy = await prisma.leavePolicy.create({
    data: {
      organizationId,
      leaveType,
      allowedDays: parseInt(allowedDays),
      carryForward: carryForward || false
    }
  });

  return policy;
};

export const fetchLeavePolicies = async (organizationId) => {
  return await prisma.leavePolicy.findMany({
    where: { organizationId },
    orderBy: { leaveType: 'asc' }
  });
};

export const fetchUserLeaveBalances = async (userId, year) => {
  const currentYear = year ? parseInt(year) : new Date().getFullYear();

  return await prisma.leaveBalance.findMany({
    where: { userId, year: currentYear },
    include: { leavePolicy: true }
  });
};

export const submitLeaveRequestData = async (userId, organizationId, data) => {
  const { leaveType, duration, startDate, endDate, totalDays, reason, attachment } = data;
  const currentYear = new Date().getFullYear();

  // Find the leave policy for this leave type in the organization
  const policy = await prisma.leavePolicy.findUnique({
    where: {
      organizationId_leaveType: {
        organizationId,
        leaveType
      }
    }
  });

  if (!policy) {
    const error = new Error(`Leave policy for type '${leaveType}' is not configured in this organization.`);
    error.statusCode = 400;
    throw error;
  }

  // Check or initialize user leave balance for the year
  let balance = await prisma.leaveBalance.findUnique({
    where: {
      userId_leavePolicyId_year: {
        userId,
        leavePolicyId: policy.id,
        year: currentYear
      }
    }
  });

  if (!balance) {
    balance = await prisma.leaveBalance.create({
      data: {
        userId,
        leavePolicyId: policy.id,
        totalDays: policy.allowedDays,
        usedDays: 0,
        remainingDays: policy.allowedDays,
        year: currentYear
      }
    });
  }

  const requestedDays = parseFloat(totalDays);

  if (balance.remainingDays < requestedDays) {
    const error = new Error(`Insufficient leave balance. Remaining days: ${balance.remainingDays}`);
    error.statusCode = 400;
    throw error;
  }

  // Create the leave request
  const leaveRequest = await prisma.leaveRequest.create({
    data: {
      userId,
      leaveType,
      duration: duration || 'FULL_DAY',
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalDays: requestedDays,
      reason,
      attachment: attachment || null,
      status: 'PENDING'
    },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true } }
    }
  });

  return leaveRequest;
};

export const fetchLeaveRequestsByOrg = async (organizationId, queryParams) => {
  const { status, userId } = queryParams;

  return await prisma.leaveRequest.findMany({
    where: {
      user: { organizationId },
      ...(status && { status }),
      ...(userId && { userId })
    },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true, department: { select: { name: true } } } },
      approvedBy: { select: { id: true, fullName: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateLeaveRequestStatus = async ({ requestId, approverId, status, rejectionReason }) => {
  const request = await prisma.leaveRequest.findUnique({
    where: { id: requestId },
    include: { user: { include: { organization: { include: { leavePolicies: true } } } } }
  });

  if (!request) {
    const error = new Error('Leave request not found.');
    error.statusCode = 404;
    throw error;
  }

  if (request.status !== 'PENDING') {
    const error = new Error(`This leave request has already been ${request.status.toLowerCase()}.`);
    error.statusCode = 400;
    throw error;
  }

  const currentYear = new Date().getFullYear();

  // If approved, deduct from user's leave balance using a transaction
  if (status === 'APPROVED') {
    const policy = request.user.organization.leavePolicies.find(p => p.leaveType === request.leaveType);
    if (policy) {
      const balance = await prisma.leaveBalance.findUnique({
        where: {
          userId_leavePolicyId_year: {
            userId: request.userId,
            leavePolicyId: policy.id,
            year: currentYear
          }
        }
      });

      if (balance) {
        const newUsedDays = balance.usedDays + request.totalDays;
        const newRemainingDays = balance.totalDays - newUsedDays;

        await prisma.$transaction([
          prisma.leaveBalance.update({
            where: { id: balance.id },
            data: {
              usedDays: newUsedDays,
              remainingDays: newRemainingDays
            }
          }),
          prisma.leaveRequest.update({
            where: { id: requestId },
            data: {
              status: 'APPROVED',
              approvedById: approverId,
              approvedAt: new Date()
            }
          })
        ]);
      }
    }
  } else if (status === 'REJECTED') {
    await prisma.leaveRequest.update({
      where: { id: requestId },
      data: {
        status: 'REJECTED',
        approvedById: approverId,
        approvedAt: new Date(),
        rejectionReason: rejectionReason || 'No reason provided'
      }
    });
  }

  return await prisma.leaveRequest.findUnique({
    where: { id: requestId },
    include: { user: { select: { id: true, fullName: true } }, approvedBy: { select: { id: true, fullName: true } } }
  });
};