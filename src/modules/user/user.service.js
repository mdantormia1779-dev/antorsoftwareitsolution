import bcrypt from 'bcryptjs';
import prisma from '../../config/prisma.js';

export const createUserData = async (organizationId, data) => {
  const {
    email,
    password,
    employeeId,
    fullName,
    phone,
    gender,
    dateOfBirth,
    nationalId,
    role,
    departmentId,
    designationId,
    branchId,
    employmentType,
    joiningDate
  } = data;

  // Check if employeeId or email already exists within the organization
  const existingUser = await prisma.user.findFirst({
    where: {
      organizationId,
      OR: [{ email }, { employeeId }]
    }
  });

  if (existingUser) {
    const error = new Error('An employee with this email or Employee ID already exists in the organization.');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : await bcrypt.hash('TempPassword123!', 10);

  const newUser = await prisma.user.create({
    data: {
      organizationId,
      email,
      password: hashedPassword,
      employeeId,
      fullName,
      phone,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      nationalId,
      role: role || 'EMPLOYEE',
      departmentId: departmentId || null,
      designationId: designationId || null,
      branchId: branchId || null,
      employmentType: employmentType || 'FULL_TIME',
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      emailVerified: true
    },
    include: {
      department: { select: { id: true, name: true } },
      designation: { select: { id: true, title: true } },
      branch: { select: { id: true, name: true } }
    }
  });

  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
};

export const fetchUsersByOrg = async (organizationId, queryParams) => {
  const { branchId, departmentId, role, status } = queryParams;

  return await prisma.user.findMany({
    where: {
      organizationId,
      ...(branchId && { branchId }),
      ...(departmentId && { departmentId }),
      ...(role && { role }),
      ...(status && { status })
    },
    include: {
      department: { select: { id: true, name: true } },
      designation: { select: { id: true, title: true } },
      branch: { select: { id: true, name: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const fetchUserById = async (userId, organizationId) => {
  const user = await prisma.user.findFirst({
    where: { id: userId, organizationId },
    include: {
      department: { select: { id: true, name: true } },
      designation: { select: { id: true, title: true } },
      branch: { select: { id: true, name: true } },
      salaryStructure: true,
      leaveBalances: { include: { leavePolicy: true } }
    }
  });

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export const updateUserData = async (userId, organizationId, updateData) => {
  // Ensure user belongs to the organization
  await fetchUserById(userId, organizationId);

  // If password is being updated, hash it
  if (updateData.password) {
    updateData.password = await bcrypt.hash(updateData.password, 10);
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...updateData,
      ...(updateData.dateOfBirth && { dateOfBirth: new Date(updateData.dateOfBirth) }),
      ...(updateData.joiningDate && { joiningDate: new Date(updateData.joiningDate) })
    },
    include: {
      department: { select: { id: true, name: true } },
      designation: { select: { id: true, title: true } },
      branch: { select: { id: true, name: true } }
    }
  });

  const { password: _, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const removeUser = async (userId, organizationId) => {
  await fetchUserById(userId, organizationId);

  await prisma.user.delete({
    where: { id: userId }
  });

  return { message: 'User account deleted successfully.' };
};