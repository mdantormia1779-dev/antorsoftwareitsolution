import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: পেন্ডিং ভেরিফিকেশন কিউ ডাটা ফেচ করা
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'PENDING';
    const userId = searchParams.get('userId');

    let targetBranchId = null;

    if (userId) {
      // ইউজার এবং তার ব্রাঞ্চ/ম্যানেজড ব্রাঞ্চ খুঁজে বের করা
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        include: { managedBranch: true, branchRef: true },
      });

      if (currentUser) {
        if (currentUser.branchId) {
          targetBranchId = currentUser.branchId;
        } else if (currentUser.managedBranch) {
          targetBranchId = currentUser.managedBranch.id;
        }
      }
    }

    // ফিল্টার কন্ডিশন: ম্যানেজার হলে তার ব্রাঞ্চ, এডমিন হলে সব
    const whereCondition = {
      status: status,
      ...(targetBranchId ? { branchId: targetBranchId } : {}),
    };

    const queueItems = await prisma.verificationQueue.findMany({
      where: whereCondition,
      include: {
        user: true,
        branch: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json({ success: true, data: queueItems }, { status: 200 });

  } catch (error) {
    console.error('Fetch Verification Queue Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PATCH: কিউ আইটেম অ্যাপ্রুভ বা রিজেক্ট করা
export async function PATCH(request) {
  try {
    const body = await request.json();
    const { queueId, status, decidedBy } = body;

    if (!queueId || !status) {
      return NextResponse.json({ success: false, message: 'Queue ID and Status are required!' }, { status: 400 });
    }

    // ট্রানজ্যাকশনের মাধ্যমে ভেরিফিকেশন কিউ আপডেট এবং ইউজারের স্ট্যাটাস পরিবর্তন করা যেতে পারে
    const updatedQueue = await prisma.verificationQueue.update({
      where: { id: queueId },
      data: {
        status: status, // "APPROVED" অথবা "REJECTED"
        decidedById: decidedBy || null,
        decidedAt: new Date(),
      },
      include: { user: true },
    });

    // যদি অ্যাপ্রুভ হয়, তবে ইউজারের ফেস স্ট্যাটাস ভেরিফাইড করে দিতে পারেন
    if (status === 'APPROVED' && updatedQueue.userId) {
      await prisma.user.update({
        where: { id: updatedQueue.userId },
        data: { faceStatus: 'VERIFIED' },
      });
    }

    return NextResponse.json({ success: true, data: updatedQueue }, { status: 200 });

  } catch (error) {
    console.error('Update Verification Queue Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}