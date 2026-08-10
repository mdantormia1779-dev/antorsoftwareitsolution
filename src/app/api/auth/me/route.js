import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    // ডাটাবেজ থেকে ইউজারের সঠিক তথ্য খোঁজা (আপনার মডেলের নাম Admin বা User হতে পারে, প্রয়োজনমতো পরিবর্তন করুন)
    const admin = await prisma.admin.findUnique({
      where: { email },
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: admin }, { status: 200 });
  } catch (error) {
    console.error('Error fetching admin profile:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}