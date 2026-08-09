import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: পেন্ডিং বা সব কিউ লিস্ট দেখতে
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const branchId = searchParams.get('branchId');
    const status = searchParams.get('status'); // PENDING, APPROVED, REJECTED

    const queues = await prisma.verificationQueue.findMany({
      where: {
        ...(branchId && { branchId }),
        ...(status && { status }),
      },
      include: {
        user: true,
        branch: true,
        attendance: true,
        decisionMaker: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: queues }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PATCH: ম্যানেজার কর্তৃক অ্যাপ্রুভ বা রিজেক্ট করতে
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { queueId, status, decidedBy } = body; // status: "APPROVED" or "REJECTED"

    if (!queueId || !status || !decidedBy) {
      return NextResponse.json({ success: false, message: 'queueId, status, and decidedBy are required.' }, { status: 400 });
    }

    const updatedQueue = await prisma.verificationQueue.update({
      where: { id: queueId },
      data: {
        status,
        decidedBy,
        decidedAt: new Date(),
      },
    });

    // যদি অ্যাপ্রুভ হয়, তবে সাথে সাথে অ্যাটেন্ডেন্স স্ট্যাটাসও আপডেট করে দিতে পারেন
    if (status === 'APPROVED') {
      await prisma.attendance.update({
        where: { id: updatedQueue.attendanceId },
        data: { status: 'PRESENT' },
      });
    }

    return NextResponse.json({ success: true, data: updatedQueue }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}