import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  try {
    const updated = await prisma.organization.update({ where: { id }, data: body });
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    await prisma.organization.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Organization deleted" });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}