import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // আপনার প্রজেক্ট অনুযায়ী প্রিজমা পাথ ঠিক করে নিবেন

export async function DELETE(request, { params }) {
  try {
    const { id } = await params; // Next.js এর লেটেস্ট ভার্সনে params অ্যাসিংক হতে পারে

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Notification ID is required' },
        { status: 400 }
      );
    }

    // ডাটাবেজ থেকে ডিলিট করা
    await prisma.notification.delete({
      where: { id: id },
    });

    return NextResponse.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting notification:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete notification', error: error.message },
      { status: 500 }
    );
  }
}