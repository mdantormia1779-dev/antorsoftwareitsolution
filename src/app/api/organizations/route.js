import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: সব অর্গানাইজেশন দেখতে
export async function GET() {
  try {
    const orgs = await prisma.organization.findMany({
      include: { branches: true, users: true },
    });
    return NextResponse.json({ success: true, data: orgs }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST: নতুন অর্গানাইজেশন তৈরি করতে
export async function POST(req) {
  try {
    const body = await req.json();
    const { name, industry, timezone, address } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: 'Organization name is required.' }, { status: 400 });
    }

    const newOrg = await prisma.organization.create({
      data: {
        name,
        industry: industry || null,
        timezone: timezone || 'UTC',
        address: address || null,
      },
    });

    return NextResponse.json({ success: true, data: newOrg }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}