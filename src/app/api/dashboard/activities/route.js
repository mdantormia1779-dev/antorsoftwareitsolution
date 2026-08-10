import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const organizationId = searchParams.get('organizationId');

    const orgFilter = organizationId ? { organizationId } : {};

    // ডাটাবেজ থেকে সাম্প্রতিক অ্যাটেন্ডেন্স বা অ্যাক্টিভিটি ফেচ করা
    const activities = await prisma.attendance.findMany({
      where: orgFilter,
      include: {
        user: true,
        branch: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6, // শেষ ৬টি অ্যাক্টিভিটি দেখানোর জন্য
    });

    const formattedActivities = activities.map((item, index) => {
      let boldText = item.user?.name || 'Employee';
      let normalText = 'checked in';
      let iconType = 'check';
      let iconBg = 'bg-emerald-100/70 text-emerald-600';

      if (item.status === 'CHECKED_OUT' || item.type === 'OUT') {
        normalText = 'checked out';
        iconType = 'logout';
        iconBg = 'bg-blue-100/70 text-blue-600';
      } else if (item.status === 'FACE_VERIFIED') {
        normalText = 'was face-verified';
        iconType = 'scan';
        iconBg = 'bg-purple-100/70 text-purple-600';
      } else if (item.status === 'FAILED') {
        normalText = 'failed verification';
        iconType = 'alert';
        iconBg = 'bg-rose-100/70 text-rose-600';
      }

      // কত সময় আগে হয়েছে তার একটি সিম্পল হিসেব
      const timeAgo = getTimeAgo(new Date(item.createdAt));
      const branchName = item.branch?.name || 'Main Branch';

      return {
        id: item.id || index,
        boldText,
        normalText,
        meta: `${branchName} · ${timeAgo}`,
        iconType,
        iconBg,
      };
    });

    return NextResponse.json({ success: true, data: formattedActivities }, { status: 200 });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// সময় হিসাব করার ছোট হেল্পার ফাংশন
function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + ' yr ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' mo ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' d ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hr ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' min ago';
  return 'Just now';
}