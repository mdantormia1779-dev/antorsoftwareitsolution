import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ঘণ্টা ও মিনিট ফরম্যাট করার হেল্পার ফাংশন (যেমন: 8.65 -> "8h 39m")
function formatHoursAndMinutes(decimalHours) {
  if (!decimalHours || isNaN(decimalHours)) return '0h 00m';
  const hours = Math.floor(decimalHours);
  const minutes = Math.round((decimalHours - hours) * 60);
  return `${hours}h ${minutes < 10 ? '0' : ''}${minutes}m`;
}

// GET: অ্যাটেন্ডেন্স রেকর্ড ফেচ করার জন্য
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const branchId = searchParams.get('branchId');
    const organizationId = searchParams.get('organizationId');

    const attendances = await prisma.attendance.findMany({
      where: {
        ...(userId && { userId }),
        ...(branchId && { branchId }),
        ...(organizationId && { 
          branch: { organizationId } 
        }),
      },
      include: {
        user: true,
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const formattedData = attendances.map((att) => {
      const name = att.user?.name || 'Unknown User';
      const nameParts = name.split(' ');
      const initials = nameParts.length > 1 
        ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase() 
        : name.substring(0, 2).toUpperCase();

      const avatarColors = ['bg-purple-600', 'bg-emerald-600', 'bg-indigo-600', 'bg-teal-600', 'bg-rose-500'];
      const avatarColor = avatarColors[name.length % avatarColors.length];

      return {
        id: att.id,
        name,
        initials,
        avatarColor,
        branch: att.branch?.name || 'Main Branch',
        checkIn: att.checkIn ? new Date(att.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '—',
        checkOut: att.checkOut ? new Date(att.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : '—',
        hours: formatHoursAndMinutes(att.hours),
        overtime: formatHoursAndMinutes(att.overtime || 0),
        faceStatus: att.faceVerified ? 'Verified' : 'Failed',
        isLate: att.status === 'LATE' || Boolean(att.isLate),
      };
    });

    return NextResponse.json({ success: true, data: formattedData }, { status: 200 });
  } catch (error) {
    console.error('Attendance GET Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: চেক-ইন বা চেক-আউট করার জন্য
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, branchId, type } = body; 

    if (!userId || !branchId || !type) {
      return NextResponse.json({ success: false, message: 'userId, branchId, and type are required.' }, { status: 400 });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (type === 'CHECK_IN') {
      const checkInTime = new Date();
      const isLate = checkInTime.getHours() >= 9 && checkInTime.getMinutes() > 15;

      const attendance = await prisma.attendance.create({
        data: {
          userId,
          branchId,
          date: today,
          checkIn: checkInTime,
          status: isLate ? 'LATE' : 'PRESENT',
          isLate: isLate,
        },
      });

      return NextResponse.json({ success: true, message: 'Checked in successfully', data: attendance }, { status: 201 });
    } 
    
    else if (type === 'CHECK_OUT') {
      const existingAttendance = await prisma.attendance.findFirst({
        where: {
          userId,
          branchId,
          date: { gte: today },
          checkOut: null,
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!existingAttendance) {
        return NextResponse.json({ success: false, message: 'No active check-in found for today.' }, { status: 404 });
      }

      const checkOutTime = new Date();
      const checkInTime = new Date(existingAttendance.checkIn);
      
      const diffMs = checkOutTime - checkInTime;
      const totalHours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
      const standardHours = 8.0;
      const overtimeHours = totalHours > standardHours ? parseFloat((totalHours - standardHours).toFixed(2)) : 0;

      const updatedAttendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          checkOut: checkOutTime,
          hours: totalHours,
          overtime: overtimeHours,
        },
      });

      return NextResponse.json({ success: true, message: 'Checked out successfully', data: updatedAttendance }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: 'Invalid action type.' }, { status: 400 });
  } catch (error) {
    console.error('Attendance POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}