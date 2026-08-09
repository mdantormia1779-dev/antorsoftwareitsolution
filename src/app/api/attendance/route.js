import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: আজকের বা নির্দিষ্ট ইউজারের অ্যাটেন্ডেন্স দেখতে
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const branchId = searchParams.get('branchId');

    const attendances = await prisma.attendance.findMany({
      where: {
        ...(userId && { userId }),
        ...(branchId && { branchId }),
      },
      include: {
        user: true,
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: attendances }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: চেক-ইন (Check-In) অথবা চেক-আউট (Check-Out) করার জন্য
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, branchId, type } = body; // type bisa "CHECK_IN" or "CHECK_OUT"

    if (!userId || !branchId || !type) {
      return NextResponse.json({ success: false, message: 'userId, branchId, and type are required.' }, { status: 400 });
    }

    // আজকের তারিখের শুরু ও শেষ নির্ধারণ (এক দিনে একটিভ এন্ট্রি ট্র্যাক করতে)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (type === 'CHECK_IN') {
      // চেক-ইন এন্ট্রি তৈরি
      const attendance = await prisma.attendance.create({
        data: {
          userId,
          branchId,
          date: today,
          checkIn: new Date(),
          status: 'PRESENT',
        },
      });
      return NextResponse.json({ success: true, message: 'Checked in successfully', data: attendance }, { status: 201 });
    } 
    
    else if (type === 'CHECK_OUT') {
      // আজকের এক্সিস্টিং চেক-ইন খুঁজে বের করে চেক-আউট আপডেট করা
      const existingAttendance = await prisma.attendance.findFirst({
        where: {
          userId,
          branchId,
          date: { gte: today },
        },
      });

      if (!existingAttendance) {
        return NextResponse.json({ success: false, message: 'No check-in found for today.' }, { status: 404 });
      }

      const checkOutTime = new Date();
      const checkInTime = new Date(existingAttendance.checkIn);
      
      // মোট কর্মঘণ্টা হিসাব করা (ঘন্টায় রূপান্তর)
      const diffMs = checkOutTime - checkInTime;
      const hours = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));

      const updatedAttendance = await prisma.attendance.update({
        where: { id: existingAttendance.id },
        data: {
          checkOut: checkOutTime,
          hours: hours,
        },
      });

      return NextResponse.json({ success: true, message: 'Checked out successfully', data: updatedAttendance }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: 'Invalid action type.' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}