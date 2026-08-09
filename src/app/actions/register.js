"use server";

import { prisma } from "@/lib/prisma";

export async function createAdminUser(data) {
  try {
    // ❌ পূর্বে ছিল: await prisma.Admin.create
    // ✅ সঠিক রূপ: await prisma.admin.create (ছোট হাতের 'a')
    const newAdmin = await prisma.admin.create({
      data: {
        id: data.id, // Firebase UID
        email: data.email,
        fullName: data.fullName,
        companyName: data.companyName,
        role: "ADMIN",
      },
    });

    return { success: true, user: newAdmin };
  } catch (error) {
    console.error("Prisma Admin Creation Error:", error);
    return { success: false, error: error.message };
  }
}