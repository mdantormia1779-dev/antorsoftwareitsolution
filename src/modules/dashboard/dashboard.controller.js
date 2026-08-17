import prisma from '../../config/prisma.js';

// ১. ড্যাশবোর্ড স্ট্যাটস ডাটা রিট্রিভ করার লজিক
export const getDashboardStatsData = async (organizationId) => {
  if (organizationId) {
    const analytics = await prisma.dashboardAnalytics.findUnique({
      where: { organizationId },
    });

    if (analytics) {
      return {
        totalBranches: analytics.totalBranches,
        totalEmployees: analytics.totalEmployees,
        presentToday: analytics.todayPresent,
        absentToday: analytics.todayAbsent,
        lateEmployees: analytics.todayLate,
        workingHours: '0h',
        totalOvertime: '0h',
      };
    }
  }

  const orgFilter = organizationId ? { organizationId } : {};
  const totalBranches = await prisma.branch.count({ where: orgFilter });
  const totalEmployees = await prisma.user.count({
    where: { ...orgFilter, role: 'EMPLOYEE' },
  });

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const attendanceFilter = {
    workDate: {
      gte: startOfDay,
      lte: endOfDay,
    },
    ...(organizationId ? {
      branch: {
        organizationId: organizationId
      }
    } : {})
  };

  const presentToday = await prisma.attendance.count({
    where: {
      ...attendanceFilter,
      status: 'PRESENT',
    },
  });

  const lateEmployees = await prisma.attendance.count({
    where: {
      ...attendanceFilter,
      isLate: true,
    },
  });

  const absentToday = Math.max(0, totalEmployees - presentToday);

  return {
    totalBranches,
    totalEmployees,
    presentToday,
    absentToday,
    lateEmployees,
    workingHours: '0h',
    totalOvertime: '0h',
  };
};

export const getDashboardStats = async (req, res) => {
  try {
    const organizationId = req.query.organizationId || req.user?.organizationId;
    const stats = await getDashboardStatsData(organizationId);
    return res.status(200).json({ success: true, data: stats });
  } catch (error) {
    console.error('Dashboard Stats Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ২. সাপ্তাহিক অ্যাটেন্ডেন্স কন্ট্রোলার
export const getWeeklyAttendance = async (req, res) => {
  try {
    const organizationId = req.query.organizationId || req.user?.organizationId;

    const attendanceFilter = organizationId ? {
      branch: {
        organizationId: organizationId
      }
    } : {};

    const rawAttendance = await prisma.attendance.findMany({
      where: attendanceFilter,
      select: {
        workDate: true,
        status: true,
      },
      orderBy: {
        workDate: 'desc',
      },
      take: 200,
    });

    const counts = { Sat: 0, Sun: 0, Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0 };

    rawAttendance.forEach(record => {
      if (record.workDate && record.status === 'PRESENT') {
        const date = new Date(record.workDate);
        const dayIndex = date.getDay();
        const dayMapping = {
          6: 'Sat',
          0: 'Sun',
          1: 'Mon',
          2: 'Tue',
          3: 'Wed',
          4: 'Thu',
          5: 'Fri'
        };
        const dayName = dayMapping[dayIndex];
        if (dayName && counts[dayName] !== undefined) {
          counts[dayName]++;
        }
      }
    });

    const weeklyData = [
      { day: 'Sat', present: counts.Sat },
      { day: 'Sun', present: counts.Sun },
      { day: 'Mon', present: counts.Mon },
      { day: 'Tue', present: counts.Tue },
      { day: 'Wed', present: counts.Wed },
      { day: 'Thu', present: counts.Thu },
      { day: 'Fri', present: counts.Fri },
    ];

    return res.status(200).json({
      success: true,
      data: weeklyData,
    });
  } catch (error) {
    console.error('Weekly Attendance Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ৩. মাসিক আওয়ার্স কন্ট্রোলার
export const getMonthlyHours = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      data: [
        { month: 'Jan', hours: 160 },
        { month: 'Feb', hours: 155 },
        { month: 'Mar', hours: 170 },
        { month: 'Apr', hours: 165 },
      ],
    });
  } catch (error) {
    console.error('Monthly Hours Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// রাউটের নামের সাথে মিল রাখতে অ্যালিয়াস এক্সপোর্ট
export const getMonthlyWorkingHours = getMonthlyHours;

// ৪. রিসেন্ট অ্যাক্টিভিটিজ কন্ট্রোলার
export const getDashboardActivities = async (req, res) => {
  try {
    const organizationId = req.query.organizationId || req.user?.organizationId;
    
    const attendanceFilter = organizationId ? {
      branch: {
        organizationId: organizationId
      }
    } : {};

    const activities = await prisma.attendance.findMany({
      where: attendanceFilter,
      include: {
        user: {
          select: {
            name: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    const formattedActivities = activities.map(act => ({
      id: act.id,
      user: act.user?.name || 'Employee',
      action: act.checkIn 
        ? `Checked in at ${new Date(act.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` 
        : 'Marked attendance',
      time: act.createdAt,
      status: act.status
    }));

    return res.status(200).json({
      success: true,
      data: formattedActivities,
    });
  } catch (error) {
    console.error('Activities Error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// রাউটের নামের সাথে মিল রাখতে অ্যালিয়াস এক্সপোর্ট
export const getRecentActivities = getDashboardActivities;