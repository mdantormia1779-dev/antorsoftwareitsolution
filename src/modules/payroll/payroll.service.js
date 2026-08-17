import prisma from '../../config/prisma.js';

export const upsertSalaryStructureData = async (organizationId, data) => {
  const { userId, baseSalary, houseRentAllowance, medicalAllowance, transportAllowance, otherAllowances, taxDeduction, providentFund } = data;

  const user = await prisma.user.findFirst({
    where: { id: userId, organizationId }
  });

  if (!user) {
    const error = new Error('Employee not found in this organization.');
    error.statusCode = 404;
    throw error;
  }

  const base = parseFloat(baseSalary || 0);
  const hra = parseFloat(houseRentAllowance || 0);
  const medical = parseFloat(medicalAllowance || 0);
  const transport = parseFloat(transportAllowance || 0);
  const others = parseFloat(otherAllowances || 0);
  const tax = parseFloat(taxDeduction || 0);
  const pf = parseFloat(providentFund || 0);

  const grossSalary = base + hra + medical + transport + others;
  const totalDeductions = tax + pf;
  const netSalary = grossSalary - totalDeductions;

  const salaryStructure = await prisma.salaryStructure.upsert({
    where: { userId },
    update: {
      basicSalary: base,
      houseRent: hra,
      foodAllowance: medical,
      otherAllowance: others,
    },
    create: {
      userId,
      basicSalary: base,
      houseRent: hra,
      foodAllowance: medical,
      otherAllowance: others,
    },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true, department: { select: { name: true } } } }
    }
  });

  return salaryStructure;
};

export const fetchSalaryStructureByUserId = async (userId, organizationId) => {
  const structure = await prisma.salaryStructure.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true, organizationId: true } }
    }
  });

  if (!structure || structure.user.organizationId !== organizationId) {
    const error = new Error('Salary structure not found for this employee.');
    error.statusCode = 404;
    throw error;
  }

  return structure;
};

export const generateMonthlyPayrollData = async (organizationId, data) => {
  const { month, year, departmentId } = data;
  const targetMonth = parseInt(month);
  const targetYear = parseInt(year);

  const users = await prisma.user.findMany({
    where: {
      organizationId,
      status: 'ACTIVE',
      ...(departmentId && { departmentId })
    },
    include: {
      salaryStructure: true
    }
  });

  const payrollRecords = [];

  for (const user of users) {
    if (!user.salaryStructure) continue;

    const struct = user.salaryStructure;

    const existingPayroll = await prisma.payroll.findFirst({
      where: {
        userId: user.id,
        month: targetMonth,
        year: targetYear
      }
    });

    if (existingPayroll) continue;

    const basic = struct.basicSalary || 0;
    const totalAllowance = (struct.houseRent || 0) + (struct.foodAllowance || 0) + (struct.otherAllowance || 0);
    const grossSalary = basic + totalAllowance;
    const totalDeduction = 0; 
    const netSalary = grossSalary - totalDeduction;

    // নতুন স্কিমা অনুযায়ী সঠিক ফিল্ডগুলো দিয়ে পে-রোল তৈরি করা হচ্ছে
    const payroll = await prisma.payroll.create({
      data: {
        userId: user.id,
        month: targetMonth,
        year: targetYear,
        workingDays: 30,
        presentDays: 30,
        absentDays: 0,
        leaveDays: 0,
        overtimeMinutes: 0,
        grossSalary: grossSalary,
        totalAllowance: totalAllowance,
        totalDeduction: totalDeduction,
        netSalary: netSalary,
        status: 'DRAFT' // স্কিমার ডিফল্ট স্ট্যাটাস অনুযায়ী
      }
    });

    payrollRecords.push(payroll);
  }

  return {
    message: `Successfully generated payroll records for ${payrollRecords.length} employees.`,
    count: payrollRecords.length,
    generatedRecords: payrollRecords
  };
};

export const fetchPayrollsByOrg = async (organizationId, queryParams) => {
  const { month, year, userId, status } = queryParams;

  return await prisma.payroll.findMany({
    where: {
      user: { organizationId },
      ...(month && { month: parseInt(month) }),
      ...(year && { year: parseInt(year) }),
      ...(userId && { userId }),
      ...(status && { status })
    },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true, department: { select: { name: true } } } }
    },
    orderBy: [{ year: 'desc' }, { month: 'desc' }]
  });
};

export const updatePayrollPaymentStatus = async (payrollId, organizationId, status) => {
  const payroll = await prisma.payroll.findUnique({
    where: { id: payrollId },
    include: { user: { select: { organizationId: true } } }
  });

  if (!payroll || payroll.user.organizationId !== organizationId) {
    const error = new Error('Payroll record not found.');
    error.statusCode = 404;
    throw error;
  }

  return await prisma.payroll.update({
    where: { id: payrollId },
    data: {
      status,
      ...(status === 'PAID' && { paidAt: new Date() })
    },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true } }
    }
  });
};