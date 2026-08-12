import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId'); 

    if (!userId) {
      return NextResponse.json({ success: false, message: 'Unauthorized: User ID missing' }, { status: 401 });
    }

    // ১. ইউজার এবং তার ব্রাঞ্চের তথ্য ফেচ করা
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { 
        managedBranch: true,
        branchRef: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    let targetBranchId = null;

    // ২. ম্যানেজার বা এমপ্লয়ীর ব্রাঞ্চ আইডি নির্ধারণ (branchId অথবা managedBranch থেকে)
    if (currentUser.branchId) {
      targetBranchId = currentUser.branchId;
    } else if (currentUser.managedBranch) {
      targetBranchId = currentUser.managedBranch.id;
    } else if (currentUser.role === 'ADMIN') {
      targetBranchId = null; // এডমিন হলে সব ব্রাঞ্চ দেখতে পারবে
    }

    // ৩. ঐ ব্রাঞ্চের মোট এমপ্লয়ী সংখ্যা গণনা
    const employeeWhereClause = targetBranchId ? { branchId: targetBranchId } : {};
    const totalEmployees = await prisma.user.count({
      where: {
        ...employeeWhereClause,
        role: 'EMPLOYEE', 
      },
    });

    // আজকের তারিখের শুরু ও শেষ সময় নির্ধারণ
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // ৪. আজকের দিনে ঐ ব্রাঞ্চের এটেন্ডেন্স ডেটা ফেচ করা
    const attendanceWhere = targetBranchId ? { branchId: targetBranchId } : {};
    const todayAttendances = await prisma.attendance.findMany({
      where: {
        ...attendanceWhere,
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    let presentCount = 0;
    let lateCount = 0;
    let totalWorkedMinutes = 0;
    let totalOvertimeMinutes = 0;

    todayAttendances.forEach((att) => {
      if (att.status === 'PRESENT') presentCount++;
      if (att.status === 'LATE' || att.isLate) lateCount++;
      
      if (att.hours) totalWorkedMinutes += att.hours * 60;
      if (att.overtimeMinutes) totalOvertimeMinutes += att.overtimeMinutes;
    });

    // অনুপস্থিত এমপ্লয়ী হিসাব (মোট এমপ্লয়ী - (প্রেজেন্ট + লেট))
    const accountedEmployees = presentCount + lateCount;
    const absentCount = Math.max(0, totalEmployees - accountedEmployees);

    // ঘণ্টা ও মিনিটে রূপান্তর
    const workingHoursNum = (totalWorkedMinutes / 60).toFixed(1) + 'h';
    const overtimeNum = (totalOvertimeMinutes / 60).toFixed(1) + 'h';

    return NextResponse.json({
      success: true,
      branchName: currentUser.branchRef?.name || 'All Branches',
      data: {
        totalEmployees: totalEmployees.toString(),
        present: presentCount.toString(),
        late: lateCount.toString(),
        absent: absentCount.toString(),
        workingHours: workingHoursNum,
        overtime: overtimeNum,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}