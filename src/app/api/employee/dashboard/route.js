import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // ১. ইউজারের তথ্য ফেচ করা
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const now = new Date();
    
    // আজকের দিন শুরু (00:00:00) এবং শেষ (23:59:59) বের করা
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayStart.getDate() + 1);

    // ২. আজকের এটেন্ডেন্স খুঁজে বের করা
    const todayAttendance = await prisma.attendance.findFirst({
      where: {
        userId: userId,
        date: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
    });

    // ফ্রন্টএন্ডের লাইভ টাইমারের জন্য সরাসরি checkIn এবং checkOut সময় পাঠানো হচ্ছে
    const checkInTime = todayAttendance?.checkIn || null;
    const checkOutTime = todayAttendance?.checkOut || null;

    // ৩. এই সপ্তাহের মোট ওভারটাইম হিসাব করা
    const startOfWeek = new Date(todayStart);
    startOfWeek.setDate(todayStart.getDate() - todayStart.getDay());

    const weeklyAttendances = await prisma.attendance.findMany({
      where: {
        userId: userId,
        date: {
          gte: startOfWeek,
        },
      },
    });

    let totalOvertimeMinutes = 0;
    weeklyAttendances.forEach((att) => {
      if (att.overtimeMinutes) {
        totalOvertimeMinutes += att.overtimeMinutes;
      } else if (att.checkIn && att.checkOut) {
        const hours = (new Date(att.checkOut).getTime() - new Date(att.checkIn).getTime()) / (1000 * 60 * 60);
        if (hours > 8) {
          totalOvertimeMinutes += Math.round((hours - 8) * 60);
        }
      }
    });

    const otHours = Math.floor(totalOvertimeMinutes / 60);
    const otMins = totalOvertimeMinutes % 60;
    const overtimeWeekly = `${otHours}h ${String(otMins).padStart(2, "0")}m`;

    // ৪. সাম্প্রতিক অ্যাক্টিভিটি (Recent Activities) তৈরি করা
    const recentLogs = weeklyAttendances.slice(0, 5).map((att) => ({
      id: att.id,
      date: att.date ? new Date(att.date).toISOString().split("T")[0] : "",
      checkIn: att.checkIn ? new Date(att.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A",
      checkOut: att.checkOut ? new Date(att.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Active",
      status: att.status || "PRESENT",
    }));

    return NextResponse.json({
      success: true,
      data: {
        name: user.fullName,
        checkInTime,   // ফ্রন্টএন্ডে সেকেন্ডসহ লাইভ টাইমারের জন্য
        checkOutTime,  // চেকআউট করা থাকলে সেটি ধরার জন্য
        overtimeWeekly,
        recentActivities: recentLogs,
      },
    });

  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}