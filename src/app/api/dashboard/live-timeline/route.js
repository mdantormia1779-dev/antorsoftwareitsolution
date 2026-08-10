import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const activities = await prisma.attendance.findMany({
      where: {
        createdAt: {
          gte: todayStart,
        },
      },
      include: {
        user: {
          select: {
            name: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    const formattedEvents = activities.map((item, index) => {
      const userName = item.user?.fullName || item.user?.name || 'An employee';
      let text = `${userName} checked in`;
      let status = 'success';

      if (item.status === 'LATE') {
        text = `${userName} arrived late`;
        status = 'danger';
      } else if (item.status === 'PENDING' || item.verificationStatus === 'failed') {
        text = `${userName} verification pending`;
        status = 'danger';
      }

      return {
        id: item.id || index + 1,
        time: new Date(item.createdAt).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        text,
        status,
      };
    });

    return NextResponse.json({ success: true, data: formattedEvents }, { status: 200 });
  } catch (error) {
    console.error('Live timeline API error:', error);
    return NextResponse.json(
      { success: false, error: error.message }, 
      { status: 500 }
    );
  }
}