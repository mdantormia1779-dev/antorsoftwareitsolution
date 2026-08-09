import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST: জিও-লোকেশন চেক বা লগ সেভ করতে
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, branchId, latitude, longitude, distanceM, withinRadius, accuracyM } = body;

    if (!userId || !branchId || latitude === undefined || longitude === undefined || withinRadius === undefined) {
      return NextResponse.json({ success: false, message: 'Required fields are missing.' }, { status: 400 });
    }

    const geoLog = await prisma.geoVerification.create({
      data: {
        userId,
        branchId,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        distanceM: parseFloat(distanceM || 0),
        withinRadius, // true / false
        accuracyM: accuracyM ? parseFloat(accuracyM) : null,
      },
    });

    return NextResponse.json({ success: true, data: geoLog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}