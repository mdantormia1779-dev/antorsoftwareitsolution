import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req) {
  try {
    const { email } = await req.json(); // অথবা ফায়ারবেস টোকেন ভেরিফাই করে ইমেইল নিতে পারেন

    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required.' }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return NextResponse.json({ success: false, message: 'Admin not found!' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Admin login successful', data: admin }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}