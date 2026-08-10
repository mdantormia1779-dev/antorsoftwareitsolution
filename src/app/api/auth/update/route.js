import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function PUT(req) {
  try {
    const { id, fullName, companyName, password } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, message: 'Admin ID is required for update.' }, { status: 400 });
    }

    // এডমিন ডেটাবেজে আছে কিনা চেক করা
    const existingAdmin = await prisma.admin.findUnique({
      where: { id }
    });

    if (!existingAdmin) {
      return NextResponse.json({ success: false, message: 'Admin not found.' }, { status: 404 });
    }

    // কোন কোন ফিল্ড আপডেট হবে তা তৈরি করা
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (companyName) updateData.companyName = companyName;

    // যদি নতুন পাসওয়ার্ড দেওয়া হয়, তবে তা হ্যাশ করে আপডেট ডাটাতে যোগ করা
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id },
      data: updateData
    });

    // পাসওয়ার্ড বাদে বাকি ডেটা রিটার্ন করা
    const { password: _, ...adminWithoutPassword } = updatedAdmin;

    return NextResponse.json({ 
      success: true, 
      message: 'Admin updated successfully', 
      data: adminWithoutPassword 
    }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}