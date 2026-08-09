import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: নোটিফিকেশন লিস্ট দেখতে
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    const notifications = await prisma.notification.findMany({
      where: organizationId ? { organizationId } : {},
      include: { branch: true, createdBy: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: notifications }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: নতুন নোটিফিকেশন সেন্ড করতে
export async function POST(req) {
  try {
    const body = await req.json();
    const { organizationId, branchId, title, body: msgBody, priority, imageUrl, createdById } = body;

    if (!organizationId || !title || !msgBody || !createdById) {
      return NextResponse.json({ success: false, message: 'Required fields are missing.' }, { status: 400 });
    }

    const newNotification = await prisma.notification.create({
      data: {
        organizationId,
        branchId: branchId || null,
        title,
        body: msgBody,
        priority: priority || 'MEDIUM',
        imageUrl: imageUrl || null,
        createdById,
      },
    });

    return NextResponse.json({ success: true, data: newNotification }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}