import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');
    const orgFilter = organizationId ? { organizationId } : {};

    // সকল অ্যাটেন্ডেন্স রেকর্ড বা ওভারটাইম ডেটা ফেচ করা
    const attendances = await prisma.attendance.findMany({
      where: {
        ...orgFilter,
        overtime: { not: null },
      },
      include: {
        user: true,
      },
    });

    // ইউজার অনুযায়ী ওভারটাইম যোগ করা (যদি একই ইউজারের একাধিক এন্ট্রি থাকে)
    const userOvertimeMap = {};

    attendances.forEach((att) => {
      if (!att.user) return;
      const userName = att.user.name;
      // নামের প্রথম অংশ ও শেষ নামের প্রথম অক্ষর (যেমন: Lucas F.)
      const nameParts = userName.split(' ');
      const formattedName = nameParts.length > 1 
        ? `${nameParts[0]} ${nameParts[1][0]}.` 
        : userName;

      const overtimeHours = Number(att.overtime) || 0; // যদি দশমিক ঘণ্টা বা মিনিট থাকে

      if (!userOvertimeMap[formattedName]) {
        userOvertimeMap[formattedName] = 0;
      }
      userOvertimeMap[formattedName] += overtimeHours;
    });

    // অ্যারেতে রূপান্তর করে ওভারটাইমের ভিত্তিতে ডিসেন্ডিং (বেশি থেকে কম) সর্ট করা
    const rankingArray = Object.keys(userOvertimeMap).map((name) => ({
      name,
      hours: parseFloat(userOvertimeMap[name].toFixed(1)),
      maxHours: 16, // সর্বোচ্চ স্কেল বা ডাইনামিক্যালি বড় মান সেট করা যেতে পারে
    }));

    rankingArray.sort((a, b) => b.hours - a.hours);

    // টপ ৫ জন পারফর্মার নেওয়া
    const topPerformers = rankingArray.slice(0, 5);

    // যদি ডাটাবেজে কোনো ওভারটাইম রেকর্ড না থাকে তবে ডিফল্ট ফলব্যাক ডাটা পাঠাতে পারেন
    const finalData = topPerformers.length > 0 ? topPerformers : [
      { name: 'Lucas F.', hours: 14.5, maxHours: 16 },
      { name: 'Ava W.', hours: 12.8, maxHours: 16 },
      { name: 'Zara H.', hours: 9.5, maxHours: 16 },
      { name: 'Noah B.', hours: 7.2, maxHours: 16 },
      { name: 'Meiling Z.', hours: 5.6, maxHours: 16 },
    ];

    return NextResponse.json({ success: true, data: finalData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching overtime ranking:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}