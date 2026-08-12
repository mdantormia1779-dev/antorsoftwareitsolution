import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { userId, faceDescriptor } = await req.json();

    if (!userId || !faceDescriptor) {
      return NextResponse.json(
        { success: false, message: 'User ID and face descriptor are required.' },
        { status: 400 }
      );
    }

    // ফেস অ্যারে ডেটাকে স্ট্রিং এ রূপান্তর করে faceEmbeddingId-তে সেভ করা
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { 
        faceEmbeddingId: JSON.stringify(faceDescriptor),
        faceStatus: 'VERIFIED' // ফেস সেভ হলে স্ট্যাটাস ভেরিফাইড হয়ে যাবে
      },
    });

    const { pin: _, ...userWithoutPin } = updatedUser;

    return NextResponse.json(
      { success: true, message: 'Face registered successfully.', data: userWithoutPin },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}