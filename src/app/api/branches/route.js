import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // সেকেন্ড ব্র্যাকেট যোগ করুন যদি named export হয়ে থাকে

// GET: সব ব্রাঞ্চের লিস্ট দেখতে
export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        employees: true, // ব্রাঞ্চের আওতাধীন এমপ্লয়িদেরও নিয়ে আসবে
      },
    });
    return NextResponse.json({ success: true, data: branches }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: নতুন ব্রাঞ্চ তৈরি করতে
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, address, organizationId, latitude, longitude, geofenceRadius } = body;

    const newBranch = await prisma.branch.create({
      data: {
        name,
        address,
        organizationId,
        latitude: latitude || 0.0,
        longitude: longitude || 0.0,
        geofenceRadius: geofenceRadius || 150,
      },
    });

    return NextResponse.json({ success: true, data: newBranch }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}