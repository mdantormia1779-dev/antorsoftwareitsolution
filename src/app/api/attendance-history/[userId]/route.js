import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // নিশ্চিত করুন এটি আপনার সেন্ট্রাল প্রিজমা ফাইল পয়েন্ট করছে

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const userId = resolvedParams?.userId;

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // ডাটাবেজ থেকে এটেন্ডেন্স কুয়েরি করা
    const attendances = await prisma.attendance.findMany({
      where: { userId: userId },
      include: {
        branch: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    const formattedHistory = attendances.map((item) => {
      let formattedDate = 'N/A';
      if (item.date) {
        try {
          formattedDate = new Date(item.date).toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          });
        } catch (e) {
          formattedDate = 'Invalid Date';
        }
      }

      const formatTime = (timeString) => {
        if (!timeString) return '--:--';
        try {
          const dateObj = new Date(timeString);
          if (isNaN(dateObj.getTime())) return '--:--';
          return dateObj.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          });
        } catch (e) {
          return '--:--';
        }
      };

      const checkInTime = formatTime(item.checkIn);
      const checkOutTime = formatTime(item.checkOut);

      let status = 'On time';
      if (item.isLate || item.status === 'LATE') {
        status = 'Late';
      } else if (item.status === 'ABSENT') {
        status = 'Absent';
      } else if (item.status === 'ON_LEAVE') {
        status = 'On Leave';
      }

      const totalHours = typeof item.hours === 'number' ? item.hours : 0;
      const hours = `${Math.floor(totalHours)}h ${Math.round((totalHours % 1) * 60)}m`;

      return {
        id: item.id,
        date: formattedDate,
        time: `${checkInTime} → ${checkOutTime}`,
        duration: hours,
        status: status,
      };
    });

    return NextResponse.json(formattedHistory, { status: 200 });
  } catch (error) {
    console.error('SERVER ERROR IN ATTENDANCE HISTORY:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}