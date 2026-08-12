import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: এমপ্লয়ি লগইন (Email এবং Pin দিয়ে)
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, pin } = body;

    // ১. ফিল্ডগুলো ঠিকমতো দেওয়া হয়েছে কি না চেক করা
    if (!email || !pin) {
      return NextResponse.json(
        { success: false, message: 'Email and pin are required for login.' },
        { status: 400 }
      );
    }

    // ২. ডাটাবেস থেকে ইমেইল দিয়ে ইউজার খোঁজা
    const employee = await prisma.user.findUnique({
      where: { email: email },
      include: {
        branchRef: true,
        organization: true,
      },
    });

    // ৩. ইউজার না পাওয়া গেলে এরর রিটার্ন করা
    if (!employee) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or pin.' },
        { status: 401 }
      );
    }

    // ৪. পিন (Pin) সঠিক আছে কি না যাচাই করা
    // (যদি আপনি হ্যাশ পাসওয়ার্ড ব্যবহার করেন, তবে এখানে bcrypt.compare করতে হবে। সাধারণ পিনের জন্য সরাসরি তুলনা করা হলো)
    if (employee.pin !== pin) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or pin.' },
        { status: 401 }
      );
    }

    // ৫. সফলভাবে লগইন হলে ইউজারের তথ্য রিটার্ন করা (পাসওয়ার্ড বা পিন বাদে পাঠানো ভালো)
    const { pin: _, ...employeeWithoutPin } = employee;

    return NextResponse.json(
      { 
        success: true, 
        message: 'Login successful.', 
        data: employeeWithoutPin 
      },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}