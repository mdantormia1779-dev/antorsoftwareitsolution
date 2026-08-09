import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { id, email, fullName, companyName } = await req.json();

    if (!id || !email || !fullName || !companyName) {
      return NextResponse.json({ success: false, message: 'All fields are required.' }, { status: 400 });
    }

    // চেক করা এডমিন আগে থেকেই আছে কিনা
    const existingAdmin = await prisma.admin.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      return NextResponse.json({ success: false, message: 'Admin with this email already exists.' }, { status: 400 });
    }

    const newAdmin = await prisma.admin.create({
      data: {
        id, // এখানে Firebase UID অথবা নিজস্ব জেনারেটেড ID দিতে পারেন
        email,
        fullName,
        companyName,
        role: 'ADMIN'
      }
    });

    return NextResponse.json({ success: true, message: 'Admin registered successfully', data: newAdmin }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}