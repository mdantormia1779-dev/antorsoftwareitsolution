import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { id, email, fullName, companyName, password } = await req.json();

    if (!id || !email || !fullName || !companyName || !password) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }

    // চেক করা এডমিন আগে থেকেই আছে কিনা
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      return NextResponse.json({ success: false, message: 'Admin with this email already exists.' }, { status: 400 });
    }

    // পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: {
        id,
        email,
        fullName,
        companyName,
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    // পাসওয়ার্ড বাদে বাকি ডেটা রিটার্ন করা
    const { password: _, ...adminWithoutPassword } = newAdmin;

    return NextResponse.json({ 
      success: true, 
      message: 'Admin registered successfully', 
      data: adminWithoutPassword 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}