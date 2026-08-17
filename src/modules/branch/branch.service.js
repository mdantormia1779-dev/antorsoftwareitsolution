import prisma from '../../config/prisma.js';

// ব্রাঞ্চ ক্রিয়েট করার সার্ভিস
const createBranchData = async (data) => {
  const { managerId, organizationId, ...restData } = data;

  try {
    return await prisma.branch.create({
      data: {
        ...restData,
        organization: {
          connect: { id: organizationId },
        },
        ...(managerId && {
          manager: {
            connect: { id: managerId },
          },
        }),
      },
      include: {
        manager: true,
        organization: true,
      },
    });
  } catch (error) {
    // প্রিজমার ইউনিক কনস্ট্রেইন্ট এরর (P2002) চেক করা হচ্ছে
    if (error.code === 'P2002' && error.meta?.target?.includes('managerId')) {
      throw new Error("Manager already assigned to another branch.");
    }
    throw error;
  }
};

// ব্রাঞ্চ আপডেট করার সার্ভিস (PATCH)
const updateBranchData = async (id, data) => {
  const { managerId, organizationId, ...restData } = data;

  try {
    return await prisma.branch.update({
      where: { id },
      data: {
        ...restData,
        ...(organizationId && {
          organization: {
            connect: { id: organizationId },
          },
        }),
        ...(managerId !== undefined && {
          manager: managerId
            ? { connect: { id: managerId } }
            : { disconnect: true },
        }),
      },
      include: {
        manager: {
          select: {
            id: true,
            fullName: true,
            email: true,
            employeeId: true,
          },
        },
      },
    });
  } catch (error) {
    // প্রিজমার ইউনিক কনস্ট্রেইন্ট এরর (P2002) চেক করা হচ্ছে
    if (error.code === 'P2002' && error.meta?.target?.includes('managerId')) {
      throw new Error("Manager already assigned to another branch.");
    }
    throw error;
  }
};

export { createBranchData, updateBranchData };

// অন্যান্য ফাংশনগুলো আগের মতোই থাকবে
export const fetchBranchesByOrg = async (organizationId) => {
  return await prisma.branch.findMany({
    where: { organizationId },
    include: {
      manager: {
        select: { id: true, fullName: true, email: true, employeeId: true }
      },
      _count: {
        select: { employees: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  });
};

export const fetchBranchById = async (branchId, organizationId) => {
  const branch = await prisma.branch.findFirst({
    where: { id: branchId, organizationId },
    include: {
      manager: {
        select: { id: true, fullName: true, email: true, employeeId: true }
      },
      employees: {
        select: { id: true, fullName: true, email: true, employeeId: true, role: true, status: true }
      }
    }
  });

  if (!branch) {
    const error = new Error('Branch not found or does not belong to this organization.');
    error.statusCode = 404;
    throw error;
  }

  return branch;
};

export const removeBranch = async (branchId, organizationId) => {
  await fetchBranchById(branchId, organizationId);

  await prisma.branch.delete({
    where: { id: branchId }
  });

  return { message: 'Branch deleted successfully.' };
};