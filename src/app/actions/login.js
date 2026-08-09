"use server";

import { prisma } from "@/lib/prisma";

export async function verifyAdminUser(uid) {
  try {
    const admin = await prisma.admin.findUnique({
      where: { id: uid },
    });

    if (!admin) {
      return { success: false, error: "Unauthorized! No admin profile found." };
    }

    return { success: true, user: admin };
  } catch (error) {
    console.error("Verify Admin Error:", error);
    return { success: false, error: "Database error occurred." };
  }
}