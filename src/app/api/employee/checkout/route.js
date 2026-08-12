import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required!' }, { status: 400 });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // আজকের এমন রেকর্ড খুঁজুন যার চেক-ইন আছে কিন্তু চেক-আউট এখনো হয়নি (null)
    const activeAttendance = await prisma.attendance.findFirst({
      where: {
        userId: userId,
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
        checkOut: null,
      },
    });

    if (!activeAttendance) {
      return NextResponse.json(
        { success: false, message: 'No active check-in found for today to check out!' },
        { status: 404 }
      );
    }

    const checkOutTime = new Date();
    const checkInTime = new Date(activeAttendance.checkIn);

    // বর্তমান সেশনের কাজের সময় (ঘণ্টায়)
    const currentSessionMs = checkOutTime - checkInTime;
    const currentSessionHours = currentSessionMs / (1000 * 60 * 60);

    // পূর্বের কোনো hours জমানো থাকলে তার সাথে বর্তমান সেশন যোগ করা (Accumulate hours)
    const previousHours = activeAttendance.hours || 0;
    const totalAccumulatedHours = previousHours + currentSessionHours;

    // ডাটাবেজ আপডেট করা
    const updatedAttendance = await prisma.attendance.update({
      where: { id: activeAttendance.id },
      data: {
        checkOut: checkOutTime,
        hours: totalAccumulatedHours, // আগের ও বর্তমান সময়ের মোট যোগফল
      },
    });

    return NextResponse.json(
      { success: true, message: 'Checked out successfully!', data: updatedAttendance },
      { status: 200 }
    );

  } catch (error) {
    console.error('Checkout API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}