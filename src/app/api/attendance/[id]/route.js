import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req, { params }) {
  const { id } = await params;
  const body = await req.json(); // e.g. { status: "ABSENT", lateMinutes: 10 }
  try {
    const updated = await prisma.attendance.update({ where: { id }, data: body });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}