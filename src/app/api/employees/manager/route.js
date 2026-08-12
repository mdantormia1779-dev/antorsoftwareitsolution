import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
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

    // ফিল্টার কন্ডিশন: যদি নির্দিষ্ট ব্রাঞ্চ হয় তবে শুধু সেই ব্রাঞ্চের এমপ্লয়ী, নতুবা এডমিন হলে সবাই
    const whereCondition = targetBranchId 
      ? { branchId: targetBranchId, role: 'EMPLOYEE' } 
      : { role: 'EMPLOYEE' }; // এডমিন হলে সব ব্রাঞ্চের এমপ্লয়ী দেখাবে

    // আজকের তারিখের শুরু ও শেষ সময় (আজকের চেক-ইন ও আওয়ার্স দেখানোর জন্য)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const employees = await prisma.user.findMany({
      where: whereCondition,
      include: {
        branchRef: true,
        attendances: {
          where: {
            date: { gte: todayStart },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: employees }, { status: 200 });

  } catch (error) {
    console.error('Fetch Employees API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}