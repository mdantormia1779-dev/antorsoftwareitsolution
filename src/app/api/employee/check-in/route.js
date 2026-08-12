import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, branchId } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: 'User ID is required!' }, { status: 400 });
    }

    // আজকের দিনের শুরু ও শেষ সময় নির্ধারণ
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // আজকের দিনের অ্যাটেন্ডেন্স রেকর্ড খোঁজা
    let attendance = await prisma.attendance.findFirst({
      where: {
        userId: userId,
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    const now = new Date();

    if (attendance) {
      // যদি ইউজার ইতিমধ্যে চেক-ইন করা অবস্থায় থাকে (চেক-আউট করা হয়নি)
      if (attendance.checkIn && !attendance.checkOut) {
        return NextResponse.json({ 
          success: true, 
          message: 'Already checked in!', 
          data: attendance 
        }, { status: 200 });
      }

      // যদি ইউজার এর আগে আজ একবার চেক-আউট করে থাকে এবং আবারও চেক-ইন করতে চায় (Second Shift)
      // এক্ষেত্রে আগের hours অপরিবর্তিত থাকবে, শুধু নতুন checkIn শুরু হবে
      attendance = await prisma.attendance.update({
        where: { id: attendance.id },
        data: {
          checkIn: now,
          checkOut: null, // আবার নতুন করে কাউন্ট শুরু হবে
          status: 'PRESENT',
        },
      });
    } else {
      // আজকের দিনে একদম প্রথম চেক-ইন
      // নোটিশ করুন: date ফিল্ডে আজকের ডেটের শুরু বা now() দিতে পারেন (ইউনিক কনস্ট্রেইন্ট ঠিক রাখতে ডেট ফরম্যাট মেইনটেইন করবেন)
      attendance = await prisma.attendance.create({
        data: {
          userId: userId,
          branchId: branchId || null,
          date: todayStart, // একই দিনে ইউনিক রাখার জন্য দিনের শুরু সেট করা ভালো
          checkIn: now,
          status: 'PRESENT',
          hours: 0, // প্রথমে ০ থাকবে
        },
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Checked in successfully!', 
      data: attendance 
    }, { status: 200 });

  } catch (error) {
    console.error('Check-in API Error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}