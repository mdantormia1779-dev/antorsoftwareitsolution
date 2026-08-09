import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: ফেস ভেরিফিকেশন হিস্ট্রি দেখতে
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    const logs = await prisma.faceVerification.findMany({
      where: userId ? { userId } : {},
      include: { user: true },
      orderBy: { capturedAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: logs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: নতুন ফেস ভেরিফিকেশন রেজルト সেভ করতে
export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, matchScore, result, providerRef } = body;

    if (!userId || matchScore === undefined || !result) {
      return NextResponse.json({ success: false, message: 'userId, matchScore, and result are required.' }, { status: 400 });
    }

    const faceLog = await prisma.faceVerification.create({
      data: {
        userId,
        matchScore: parseFloat(matchScore),
        result, // "VERIFIED" or "FAILED"
        providerRef: providerRef || null,
      },
    });

    // ইউজারের ফেস স্ট্যাটাস আপডেট করতে পারেন চাইলে
    await prisma.user.update({
      where: { id: userId },
      data: { faceStatus: result === "VERIFIED" ? "VERIFIED" : "FAILED" },
    });

    return NextResponse.json({ success: true, data: faceLog }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}