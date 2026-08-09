import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 🔍 GET: নির্দিষ্ট একটি ব্রাঞ্চের তথ্য দেখতে
export async function GET(req, { params }) {
  try {
    const { id } = await params;

    const branch = await prisma.branch.findUnique({
      where: { id },
      include: {
        employees: true,
        manager: true,
        organization: true,
      },
    });

    if (!branch) {
      return NextResponse.json({ success: false, message: 'Branch not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: branch }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// ✏️ PATCH: ব্রাঞ্চের তথ্য আপডেট করতে
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const { 
      name, 
      address, 
      latitude, 
      longitude, 
      geofenceRadius, 
      startTime, 
      endTime, 
      weeklyHolidays,
      managerId 
    } = body;

    const updatedBranch = await prisma.branch.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(address && { address }),
        ...(latitude !== undefined && { latitude: parseFloat(latitude) }),
        ...(longitude !== undefined && { longitude: parseFloat(longitude) }),
        ...(geofenceRadius !== undefined && { geofenceRadius: parseInt(geofenceRadius) }),
        ...(startTime && { startTime }),
        ...(endTime && { endTime }),
        ...(weeklyHolidays && { weeklyHolidays }),
        managerId: managerId !== undefined ? managerId : undefined,
      },
    });

    return NextResponse.json({ success: true, data: updatedBranch }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 🗑️ DELETE: ব্রাঞ্চ ডিলিট করতে
export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    // ব্রাঞ্চটি আছে কিনা চেক করা
    const branchExists = await prisma.branch.findUnique({ where: { id } });
    if (!branchExists) {
      return NextResponse.json({ success: false, message: 'Branch not found' }, { status: 404 });
    }

    await prisma.branch.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Branch deleted successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}