import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: সব অডিট লগ দেখতে
export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      include: { actor: true },
      orderBy: { createdAt: 'desc' },
      take: 100, // সর্বশেষ ১০০টি লগ
    });

    return NextResponse.json({ success: true, data: logs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}