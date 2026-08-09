import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: সব এমপ্লয়ির লিস্ট দেখতে
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');
    const branchId = searchParams.get('branchId');

    const employees = await prisma.user.findMany({
      where: {
        ...(organizationId && { organizationId }),
        ...(branchId && { branchId }),
      },
      include: {
        branchRef: true,
        organization: true,
      },
    });

    return NextResponse.json({ success: true, data: employees }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: নতুন এমপ্লয়ি তৈরি করতে
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

    if (!organizationId || !empCode || !fullName || !email || !pin) {
      return NextResponse.json(
        { success: false, message: 'Required fields (organizationId, empCode, fullName, email, pin) are missing.' }, 
        { status: 400 }
      );
    }

    const newEmployee = await prisma.user.create({
      data: {
        organizationId,
        empCode,
        fullName,
        email,
        phone: phone || null,
        pin,
        role: role || 'EMPLOYEE',
        branchId: branchId || null,
        department: department || 'Engineering',
        designation: designation || 'Frontend Developer',
      },
    });

    return NextResponse.json({ success: true, data: newEmployee }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT: এমপ্লয়ির তথ্য আপডেট করতে
export async function PUT(req) {
  try {
    const body = await req.json();
    const { 
      id, // এখানে ID পাঠাতে হবে
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

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Employee ID is required for update.' }, 
        { status: 400 }
      );
    }

    const updatedEmployee = await prisma.user.update({
      where: { id: id },
      data: {
        organizationId,
        empCode,
        fullName,
        email,
        phone,
        pin,
        role,
        branchId,
        department,
        designation,
      },
    });

    return NextResponse.json({ success: true, data: updatedEmployee }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: এমপ্লয়ি ডিলিট করতে
export async function DELETE(req) {
  try {
    const body = await req.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Employee ID is required for deletion.' },
        { status: 400 }
      );
    }

    // ডাটাবেস থেকে এমপ্লয়ি রিমুভ করা
    await prisma.user.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { success: true, message: 'Employee deleted successfully.' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}