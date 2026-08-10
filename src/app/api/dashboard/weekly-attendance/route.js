import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');
    
    // ডাইনামিক অর্গানাইজেশন ফিল্টার (যদি থাকে)
    const orgFilter = organizationId ? { organizationId } : {};

    // সপ্তাহের দিনগুলোর তালিকা
    const days = [
      { key: 1, name: 'Mon' },
      { key: 2, name: 'Tue' },
      { key: 3, name: 'Wed' },
      { key: 4, name: 'Thu' },
      { key: 5, name: 'Fri' },
      { key: 6, name: 'Sat' },
      { key: 0, name: 'Sun' },
    ];

    // স্ট্যাটাস ফিল্টার ছাড়াই সমস্ত অ্যাটেন্ডেন্স ফেচ করা (যাতে ক্র্যাশ না করে)
    const allAttendances = await prisma.attendance.findMany({
      where: {
        ...orgFilter,
      },
    });

    // দিন অনুযায়ী কাউন্ট বের করা
    const chartData = days.map((d) => {
      const countForDay = allAttendances.filter((att) => {
        const dateValue = att.date || att.createdAt;
        if (!dateValue) return false;
        const attDay = new Date(dateValue).getDay();
        return attDay === d.key;
      }).length;

      return {
        day: d.name,
        present: countForDay, // ডাটা না থাকলে ০ দেখাবে
      };
    });

    return NextResponse.json({ success: true, data: chartData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching weekly attendance:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}