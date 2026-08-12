import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required!' }, { status: 400 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: userId,
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const isCheckedIn = Boolean(attendance && attendance.checkIn && !attendance.checkOut);

    return NextResponse.json({
      success: true,
      isCheckedIn,
      checkInTime: attendance?.checkIn || null,
      attendance: attendance || null,
    }, { status: 200 });

  } catch (error) {
    console.error('Attendance Status Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}