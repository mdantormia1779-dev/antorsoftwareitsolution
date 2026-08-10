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
// POST: নতুন নোটিফিকেশন সেন্ড করতে
export async function POST(req) {
  try {
    const body = await req.json();
    const { organizationId, branchId, title, body: msgBody, priority, imageUrl, createdById, email, fullName, role, companyName } = body;

    if (!organizationId || !title || !msgBody) {
      return NextResponse.json({ success: false, message: 'Required fields are missing.' }, { status: 400 });
    }

    const userId = createdById || 'admin-1786269776983';
    const userEmail = email || 'mdantormia1779@gmail.com';

    // ১. চেক করুন ডাটাবেজে ইউজার আছে কি না (প্রথমে ID দিয়ে, না পেলে Email দিয়ে)
    let dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: userId },
          { email: userEmail }
        ]
      }
    });

    // ২. যদি ডাটাবেজে ইউজার না থাকে, তবে লোকাল স্টোরেজ থেকে পাওয়া তথ্য দিয়ে স্বয়ংক্রিয়ভাবে ইউজার তৈরি করে নিন
    if (!dbUser) {
      try {
        dbUser = await prisma.user.create({
          data: {
            id: userId,
            email: userEmail,
            fullName: fullName || 'Md Antor Mia',
            role: role || 'ADMIN',
            companyName: companyName || 'Antor Software & It Solution',
            organizationId: organizationId, // অর্গানাইজেশন আইডি ম্যাপ করা
          },
        });
      } catch (err) {
        // যদি ইউজার ক্রিয়েট করতে গিয়ে অর্গানাইজেশন বা অন্য কোনো কারণে ফেইল করে, তবে ডাটাবেজের প্রথম যেকোনো ইউজার বেছে নেওয়া
        dbUser = await prisma.user.findFirst();
      }
    }

    if (!dbUser) {
      return NextResponse.json({ 
        success: false, 
        message: 'No valid user found or created in the database.' 
      }, { status: 400 });
    }

    // ৩. নোটিফিকেশন তৈরি করা
    const newNotification = await prisma.notification.create({
      data: {
        organizationId,
        branchId: branchId || null,
        title,
        body: msgBody,
        priority: priority || 'MEDIUM',
        createdById: dbUser.id, // নিশ্চিত সঠিক ডাটাবেজ ইউজার আইডি
      },
    });

    return NextResponse.json({ success: true, data: newNotification }, { status: 201 });
  } catch (error) {
    console.error('Notification POST Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


// PUT: নোটিফিকেশন আপডেট করতে
export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, title, body: msgBody, priority, branchId } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Notification ID is required.' }, { status: 400 });
    }

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: {
        title,
        body: msgBody,
        priority: priority || 'MEDIUM',
        branchId: branchId || null,
      },
    });

    return NextResponse.json({ success: true, data: updatedNotification }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}