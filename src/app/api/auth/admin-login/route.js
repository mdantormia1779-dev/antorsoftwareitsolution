import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: 'Email and password are required.' }, { status: 400 });
    }

    // ইমেইল দিয়ে এডমিন খোঁজা
    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
    }

    // পাসওয়ার্ড মিলিয়ে দেখা (Password verification)
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return NextResponse.json({ success: false, message: 'Invalid email or password.' }, { status: 401 });
    }

    // সিকিউরিটির জন্য পাসওয়ার্ডটি রেসপন্স থেকে বাদ দেওয়া
    const { password: _, ...adminWithoutPassword } = admin;

    return NextResponse.json({ 
      success: true, 
      message: 'Admin login successful', 
      data: adminWithoutPassword 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}