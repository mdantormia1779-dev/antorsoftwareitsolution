import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    const orgFilter = organizationId ? { organizationId } : {};

    // ১. মোট ব্রাঞ্চ কাউন্ট
    const totalBranches = await prisma.branch.count({
      where: orgFilter,
    });

    // ২. মোট এমপ্লয়ি কাউন্ট
    const totalEmployees = await prisma.user.count({
      where: orgFilter,
    });

    // আজকের তারিখ বের করা (টাইম জোন হ্যান্ডেল করার জন্য)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // ৩. আজকের প্রেজেন্ট, এবসেন্ট এবং লেট অ্যাটেন্ডেন্স কাউন্ট
    // (আপনার প্রজেক্টের Attendance মডেল অনুযায়ী কোডটি এখানে সেট করা হয়েছে)
    const todayAttendances = await prisma.attendance.findMany({
      where: {
        ...orgFilter,
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    const presentToday = todayAttendances.filter(a => a.status === 'PRESENT' || a.status === 'ON_TIME').length;
    const lateEmployees = todayAttendances.filter(a => a.status === 'LATE').length;
    const absentToday = totalEmployees - (presentToday + lateEmployees);

    return NextResponse.json({
      success: true,
      data: {
        totalBranches,
        totalEmployees,
        presentToday: presentToday < 0 ? 0 : presentToday,
        absentToday: absentToday < 0 ? 0 : absentToday,
        lateEmployees,
        workingHours: '1,624h', // এটি চাইলে আপনি ডাইনামিক করতে পারেন
        totalOvertime: '96h',   // এটিও চাইলে ડাইনামিক করতে পারেন
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}