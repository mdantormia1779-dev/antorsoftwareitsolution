import prisma from '../../config/prisma.js';

/**
 * ১. পারফরম্যান্স রিভিউ তৈরি করা
 */
export const createPerformanceReviewData = async (organizationId, reviewerId, data) => {
  const { userId, reviewPeriod, ratings, feedback, goals, status } = data;

  const user = await prisma.user.findFirst({
    where: { id: userId, organizationId }
  });

  if (!user) {
    const error = new Error('Employee not found in this organization.');
    error.statusCode = 404;
    throw error;
  }

  const review = await prisma.performanceReview.create({
    data: {
      userId,
      reviewerId,
      reviewPeriod,
      ratings: ratings ? parseFloat(ratings) : 0,
      feedback,
      goals,
      status: status || 'DRAFT'
    },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true, department: { select: { name: true } } } },
      reviewer: { select: { id: true, fullName: true, employeeId: true } }
    }
  });

  return review;
};

/**
 * ২. পারফরম্যান্স রিভিউগুলো ফেচ করা
 */
export const fetchPerformanceReviewsByOrg = async (organizationId, queryParams) => {
  const { userId, reviewerId, status, reviewPeriod } = queryParams;

  return await prisma.performanceReview.findMany({
    where: {
      user: { organizationId },
      ...(userId && { userId }),
      ...(reviewerId && { reviewerId }),
      ...(status && { status }),
      ...(reviewPeriod && { reviewPeriod })
    },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true, department: { select: { name: true } } } },
      reviewer: { select: { id: true, fullName: true, employeeId: true } }
    },
    orderBy: { createdAt: 'desc' }
  });
};

/**
 * ৩. পারফরম্যান্স রিভিউ আপডেট করা
 */
export const updatePerformanceReviewData = async (reviewId, organizationId, updateData) => {
  const review = await prisma.performanceReview.findUnique({
    where: { id: reviewId },
    include: { user: { select: { organizationId: true } } }
  });

  if (!review || review.user.organizationId !== organizationId) {
    const error = new Error('Performance review not found.');
    error.statusCode = 404;
    throw error;
  }

  return await prisma.performanceReview.update({
    where: { id: reviewId },
    data: {
      ...updateData,
      ...(updateData.ratings && { ratings: parseFloat(updateData.ratings) })
    },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true } },
      reviewer: { select: { id: true, fullName: true, employeeId: true } }
    }
  });
};

/**
 * সেফলি প্রিজমা থেকে KPI ডেলিগেট পাওয়ার ফাংশন
 */
const getKpiDelegate = () => {
  return prisma.kpi || prisma.KPI || prisma.kPI;
};

/**
 * ৪. KPI তৈরি বা আপডেট করা
 */
export const createOrUpdateKpiData = async (organizationId, data) => {
  const { userId, title, description, targetValue, currentValue, weight, status, dueDate } = data;

  const user = await prisma.user.findFirst({
    where: { id: userId, organizationId }
  });

  if (!user) {
    const error = new Error('Employee not found.');
    error.statusCode = 404;
    throw error;
  }

  const kpiDelegate = getKpiDelegate();
  if (!kpiDelegate) {
    throw new Error("Prisma client does not have a 'kpi' model. Please run 'npx prisma generate'.");
  }

  const kpi = await kpiDelegate.create({
    data: {
      userId,
      title,
      description,
      targetValue: parseFloat(targetValue),
      currentValue: currentValue ? parseFloat(currentValue) : 0,
      weight: weight ? parseFloat(weight) : 1.0,
      status: status || 'IN_PROGRESS',
      dueDate: dueDate ? new Date(dueDate) : null
    },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true } }
    }
  });

  return kpi;
};

/**
 * ৫. ইউজারের KPI লিস্ট ফেচ করা
 */
export const fetchUserKpis = async (userId) => {
  const kpiDelegate = getKpiDelegate();
  if (!kpiDelegate) {
    throw new Error("Prisma client does not have a 'kpi' model. Please run 'npx prisma generate'.");
  }

  return await kpiDelegate.findMany({
    where: { userId },
    orderBy: { dueDate: 'asc' }
  });
};

/**
 * ৬. মাসভিত্তিক EmployeePerformance স্কোর তৈরি বা আপডেট করা (Upsert)
 */
export const upsertEmployeePerformanceData = async (organizationId, data) => {
  const { userId, month, year, attendanceScore, punctualityScore, overtimeScore, overallScore, performanceLevel, remarks } = data;

  const user = await prisma.user.findFirst({
    where: { id: userId, organizationId }
  });

  if (!user) {
    const error = new Error('Employee not found in this organization.');
    error.statusCode = 404;
    throw error;
  }

  const targetMonth = parseInt(month);
  const targetYear = parseInt(year);

  const performance = await prisma.employeePerformance.upsert({
    where: {
      userId_month_year: {
        userId,
        month: targetMonth,
        year: targetYear
      }
    },
    update: {
      attendanceScore: attendanceScore ? parseFloat(attendanceScore) : 0,
      punctualityScore: punctualityScore ? parseFloat(punctualityScore) : 0,
      overtimeScore: overtimeScore ? parseFloat(overtimeScore) : 0,
      overallScore: overallScore ? parseFloat(overallScore) : 0,
      performanceLevel,
      remarks
    },
    create: {
      userId,
      month: targetMonth,
      year: targetYear,
      attendanceScore: attendanceScore ? parseFloat(attendanceScore) : 0,
      punctualityScore: punctualityScore ? parseFloat(punctualityScore) : 0,
      overtimeScore: overtimeScore ? parseFloat(overtimeScore) : 0,
      overallScore: overallScore ? parseFloat(overallScore) : 0,
      performanceLevel,
      remarks
    },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true, department: { select: { name: true } } } }
    }
  });

  return performance;
};

/**
 * ৭. অর্গানাইজেশনের এমপ্লয়ী পারফর্মেন্স স্কোরগুলো ফিল্টার করে ফেচ করা
 */
export const fetchEmployeePerformancesByOrg = async (organizationId, queryParams) => {
  const { userId, month, year, performanceLevel } = queryParams;

  return await prisma.employeePerformance.findMany({
    where: {
      user: { organizationId },
      ...(userId && { userId }),
      ...(month && { month: parseInt(month) }),
      ...(year && { year: parseInt(year) }),
      ...(performanceLevel && { performanceLevel })
    },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true, department: { select: { name: true } } } }
    },
    orderBy: [{ year: 'desc' }, { month: 'desc' }]
  });
};