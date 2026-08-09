import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { empCode, pin } = await req.json();

    if (!empCode || !pin) {
      return NextResponse.json({ success: false, message: 'Employee Code and PIN are required.' }, { status: 400 });
    }

    // ডাটাবেজ থেকে ইউজার খোঁজা
    const user = await prisma.user.findUnique({
      where: { empCode },
      include: { organization: true, branchRef: true }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found!' }, { status: 404 });
    }

    // পিন (PIN) ম্যাচ করা
    if (user.pin !== pin) {
      return NextResponse.json({ success: false, message: 'Invalid PIN!' }, { status: 401 });
    }

    // সফল লগইন হলে ইউজারের তথ্য রিটার্ন করা (পাসওয়ার্ড/পিন বাদে)
    const { pin: _, ...userData } = user;

    return NextResponse.json({ 
      success: true, 
      message: 'Login successful', 
      data: userData 
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}