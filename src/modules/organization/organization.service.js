import prisma from '../../config/prisma.js';

export const createOrganizationData = async (data) => {
  const { name, industry, email, phone, website, logo, address, timezone } = data;

  if (!name) {
    const error = new Error('Organization name is required.');
    error.statusCode = 400;
    throw error;
  }

  try {
    const organization = await prisma.organization.create({
      data: {
        name,
        industry: industry || null,
        email: email || null,
        phone: phone || null,
        website: website || null,
        logo: logo || null,
        address: address || null,
        timezone: timezone || 'UTC'
      }
    });

    return organization;
  } catch (error) {
    console.error('Prisma Error Details:', error); // এটি টার্মিনালে আসল কারণ দেখিয়ে দিবে
    
    // প্রিজমার নির্দিষ্ট এরর কোড হ্যান্ডেল করা
    if (error.code === 'P2002') {
      const customErr = new Error('An organization with this name or email already exists.');
      customErr.statusCode = 400;
      throw customErr;
    }
    
    error.statusCode = 500;
    throw error;
  }
};

export const fetchOrganizationById = async (organizationId) => {
  if (!organizationId) {
    const error = new Error('Organization ID is required.');
    error.statusCode = 400;
    throw error;
  }

  const organization = await prisma.organization.findUnique({
    where: { id: organizationId }
  });

  if (!organization) {
    const error = new Error('Organization not found.');
    error.statusCode = 404;
    throw error;
  }

  return organization;
};

export const updateOrganizationData = async (organizationId, data) => {
  if (!organizationId) {
    const error = new Error('Organization ID is required.');
    error.statusCode = 400;
    throw error;
  }

  const organization = await prisma.organization.update({
    where: { id: organizationId },
    data
  });

  return organization;
};

export const fetchOrgAnalytics = async (organizationId) => {
  if (!organizationId) {
    const error = new Error('Organization ID is required.');
    error.statusCode = 400;
    throw error;
  }

  const totalEmployees = await prisma.user.count({
    where: { organizationId }
  });

  return {
    totalEmployees,
    activeProjects: 0,
    attendanceToday: 0
  };
};

// সবগুলো অর্গানাইজেশন একসাথে পাওয়ার জন্য
export const fetchAllOrganizations = async () => {
  try {
    const organizations = await prisma.organization.findMany({
      orderBy: { createdAt: 'desc' }, // নতুনগুলো আগে দেখাবে
    });
    return organizations;
  } catch (error) {
    console.error('Prisma Error Details:', error);
    error.statusCode = 500;
    throw error;
  }
};

export const deleteOrganizationData = async (organizationId) => {
  if (!organizationId) {
    const error = new Error('Organization ID is required.');
    error.statusCode = 400;
    throw error;
  }

  try {
    const deletedOrg = await prisma.organization.delete({
      where: { id: organizationId },
    });
    return deletedOrg;
  } catch (error) {
    console.error('Prisma Delete Error:', error);
    if (error.code === 'P2025') {
      const customErr = new Error('Organization not found.');
      customErr.statusCode = 404;
      throw customErr;
    }
    error.statusCode = 500;
    throw error;
  }
};