import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');
    const orgFilter = organizationId ? { organizationId } : {};

    // আপনি চাইলে Attendance বা WorkHour টেবিল থেকে রিয়েল ডেটা আনতে পারেন।
    // এখানে উদাহরণস্বরূপ ৪টি সপ্তাহের (W1 - W4) ডাইনামিক কাঠামো তৈরি করা হলো:
    const attendances = await prisma.attendance.findMany({
      where: orgFilter,
    });

    // ডেমো বা রিয়েল ক্যালকুলেশন (চাইলে আপনার প্রজেক্টের লজিক অনুযায়ী ফিল্টার করতে পারেন)
    const monthlyData = [
      { week: 'W1', workingHours: 4100, overtime: 200 },
      { week: 'W2', workingHours: 4250, overtime: 250 },
      { week: 'W3', workingHours: 4000, overtime: 180 },
      { week: 'W4', workingHours: 4350, overtime: 280 },
    ];

    return NextResponse.json({ success: true, data: monthlyData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching monthly working hours:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}