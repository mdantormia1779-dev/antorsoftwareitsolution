import prisma from '../../config/prisma.js';

export const generateAttendanceReportData = async (organizationId, queryParams) => {
  const { startDate, endDate, branchId, departmentId } = queryParams;

  const start = startDate ? new Date(startDate) : new Date(new Date().setDate(1)); // Default to start of current month
  const end = endDate ? new Date(endDate) : new Date(); // Default to today
  end.setHours(23, 59, 59, 999);

  const attendanceRecords = await prisma.attendance.findMany({
    where: {
      workDate: {
        gte: start,
        lte: end
      },
      branch: {
        organizationId,
        ...(branchId && { id: branchId })
      },
      user: {
        ...(departmentId && { departmentId })
      }
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          employeeId: true,
          department: { select: { id: true, name: true } },
          branch: { select: { id: true, name: true } }
        }
      },
      branch: { select: { id: true, name: true } }
    },
    orderBy: { workDate: 'desc' }
  });

  // Calculate high-level summary metrics
  const totalRecords = attendanceRecords.length;
  const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT').length;
  const lateCount = attendanceRecords.filter(r => r.isLate).length;
  const totalOvertimeMinutes = attendanceRecords.reduce((acc, curr) => acc + (curr.overtimeMinutes || 0), 0);

  return {
    reportType: 'ATTENDANCE_REPORT',
    dateRange: { startDate: start, endDate: end },
    summary: {
      totalRecords,
      presentCount,
      lateCount,
      totalOvertimeHours: (totalOvertimeMinutes / 60).toFixed(2)
    },
    records: attendanceRecords
  };
};

export const generatePayrollReportData = async (organizationId, queryParams) => {
  const { month, year, departmentId } = queryParams;
  const targetMonth = month ? parseInt(month) : new Date().getMonth() + 1;
  const targetYear = year ? parseInt(year) : new Date().getFullYear();

  const payrolls = await prisma.payroll.findMany({
    where: {
      month: targetMonth,
      year: targetYear,
      user: {
        organizationId,
        ...(departmentId && { departmentId })
      }
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          employeeId: true,
          department: { select: { id: true, name: true } },
          designation: { select: { id: true, title: true } }
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  // Aggregate financial metrics
  const totalPayrollCost = payrolls.reduce((acc, curr) => acc + Number(curr.netSalary), 0);
  const totalGross = payrolls.reduce((acc, curr) => acc + Number(curr.grossSalary), 0);
  const totalDeductions = payrolls.reduce((acc, curr) => acc + Number(curr.deductions), 0);
  const paidCount = payrolls.filter(p => p.status === 'PAID').length;
  const pendingCount = payrolls.filter(p => p.status === 'PENDING').length;

  return {
    reportType: 'PAYROLL_REPORT',
    period: { month: targetMonth, year: targetYear },
    summary: {
      totalEmployeesPaid: payrolls.length,
      paidCount,
      pendingCount,
      totalGrossSalary: totalGross.toFixed(2),
      totalDeductions: totalDeductions.toFixed(2),
      totalNetPayrollCost: totalPayrollCost.toFixed(2)
    },
    payrolls
  };
};

export const generateLeaveReportData = async (organizationId, queryParams) => {
  const { year, status } = queryParams;
  const targetYear = year ? parseInt(year) : new Date().getFullYear();

  const leaveRequests = await prisma.leaveRequest.findMany({
    where: {
      user: { organizationId },
      startDate: {
        gte: new Date(`${targetYear}-01-01`),
        lte: new Date(`${targetYear}-12-31`)
      },
      ...(status && { status })
    },
    include: {
      user: {
        select: {
          id: true,
          fullName: true,
          employeeId: true,
          department: { select: { id: true, name: true } }
        }
      },
      approvedBy: { select: { id: true, fullName: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  const totalRequests = leaveRequests.length;
  const approvedCount = leaveRequests.filter(r => r.status === 'APPROVED').length;
  const pendingCount = leaveRequests.filter(r => r.status === 'PENDING').length;
  const rejectedCount = leaveRequests.filter(r => r.status === 'REJECTED').length;

  return {
    reportType: 'LEAVE_REPORT',
    year: targetYear,
    summary: {
      totalRequests,
      approvedCount,
      pendingCount,
      rejectedCount
    },
    leaveRequests
  };
};

export const generateHeadcountReportData = async (organizationId) => {
  const users = await prisma.user.findMany({
    where: { organizationId },
    include: {
      department: { select: { id: true, name: true } },
      designation: { select: { id: true, title: true } },
      branch: { select: { id: true, name: true } }
    }
  });

  const totalEmployees = users.length;
  const activeCount = users.filter(u => u.status === 'ACTIVE').length;
  const inactiveCount = users.filter(u => u.status === 'INACTIVE').length;

  // Group by department
  const departmentBreakdown = users.reduce((acc, user) => {
    const deptName = user.department ? user.department.name : 'Unassigned';
    acc[deptName] = (acc[deptName] || 0) + 1;
    return acc;
  }, {});

  return {
    reportType: 'HEADCOUNT_REPORT',
    summary: {
      totalEmployees,
      activeCount,
      inactiveCount,
      departmentBreakdown
    },
    employees: users.map(u => ({
      id: u.id,
      employeeId: u.employeeId,
      fullName: u.fullName,
      email: u.email,
      role: u.role,
      status: u.status,
      employmentType: u.employmentType,
      department: u.department?.name || 'N/A',
      designation: u.designation?.title || 'N/A',
      branch: u.branch?.name || 'N/A',
      joiningDate: u.joiningDate
    }))
  };
};