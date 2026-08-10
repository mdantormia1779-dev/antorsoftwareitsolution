import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    // আজকের দিনের শুরু এবং শেষ সময় নির্ধারণ
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // মোট এমপ্লয়ী বা ইউজারের সংখ্যা
    const totalEmployees = await prisma.user.count();

    // আজকের অ্যাটেন্ডেন্স ডাটা ফেচ করা (যদি আপনার Attendance টেবিল থাকে)
    const attendances = await prisma.attendance.findMany({
      where: {
        createdAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    }).catch(() => []); // টেবিল না থাকলে এরর এড়ানোর জন্য খালি অ্যারে রিটার্ন করবে

    const present = attendances.filter(a => a.status === 'PRESENT').length;
    const late = attendances.filter(a => a.status === 'LATE').length;
    const absent = Math.max(0, totalEmployees - (present + late));

    return NextResponse.json({
      success: true,
      data: {
        totalEmployees: totalEmployees.toString(),
        present: present.toString(),
        late: late.toString(),
        absent: absent.toString(),
        workingHours: '398h', // প্রয়োজনমতো ডায়নামিক বা স্ট্যাটিক রাখতে পারেন
        overtime: '21h',
      }
    });
  } catch (error) {
    console.error('Dashboard Stats API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}