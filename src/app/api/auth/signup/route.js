import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const body = await req.json();
    const { 
      organizationId, 
      empCode, 
      fullName, 
      email, 
      phone, 
      pin, 
      role, 
      branchId, 
      department, 
      designation 
    } = body;

    // প্রয়োজনীয় ফিল্ড চেক করা
    if (!organizationId || !empCode || !fullName || !email || !pin) {
      return NextResponse.json(
        { success: false, message: 'Required fields (organizationId, empCode, fullName, email, pin) are missing.' }, 
        { status: 400 }
      );
    }

    // চেক করা এমপ্লয়ি কোড বা ইমেইল ইতিমধ্যে আছে কিনা
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { empCode },
          { email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Employee Code or Email already exists!' }, 
        { status: 400 }
      );
    }

    // নতুন ইউজার তৈরি করা
    const newUser = await prisma.user.create({
      data: {
        organizationId,
        empCode,
        fullName,
        email,
        phone: phone || null,
        pin, // প্রোডাকশনে পিন এনক্রিপ্ট করে (bcrypt দিয়ে) সেভ করা ভালো
        role: role || 'EMPLOYEE',
        branchId: branchId || null,
        department: department || 'Engineering',
        designation: designation || 'Frontend Developer',
      },
    });

    // পিন বাদে ইউজারের তথ্য রিটার্ন করা
    const { pin: _, ...userData } = newUser;

    return NextResponse.json({ 
      success: true, 
      message: 'Registration successful!', 
      data: userData 
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}