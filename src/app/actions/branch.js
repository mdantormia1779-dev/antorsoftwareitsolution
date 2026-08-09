'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ১. সকল ব্রাঞ্চ নিয়ে আসা
export async function getBranchesAction() {
  try {
    const branches = await prisma.branch.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: branches };
  } catch (error) {
    console.error('Fetch Branches Error:', error);
    return { success: false, error: 'Failed to fetch branches' };
  }
}

// ২. ম্যানেজারদের লিস্ট
export async function getManagersAction() {
  try {
    const managers = await prisma.user.findMany({
      where: { role: 'MANAGER' },
      select: { id: true, fullName: true, email: true },
    });
    return { success: true, data: managers };
  } catch (error) {
    console.error('Fetch Managers Error:', error);
    return { success: false, error: 'Failed to fetch managers' };
  }
}

// ৩. নতুন ব্রাঞ্চ তৈরি
export async function createBranchAction(formData) {
  try {
    const newBranch = await prisma.branch.create({
      data: {
        name: formData.name,
        address: formData.address,
        manager: formData.manager || 'Unassigned',
        geofenceRadius: parseInt(formData.geofenceRadius, 10) || 150,
        startTime: formData.startTime || '09:00 AM',
        endTime: formData.endTime || '06:00 PM',
        weeklyHolidays: formData.weeklyHolidays, // Prisma Schema-তে এটা String[] হলে ঠিক আছে
      },
    });

    revalidatePath('/branches');
    return { success: true, data: newBranch };
  } catch (error) {
    console.error('Create Branch Error:', error);
    return { success: false, error: 'Failed to create branch' };
  }
}

// ৪. ব্রাঞ্চ আপডেট (ফিক্সড)
export async function updateBranchAction(id, formData) {
  try {
    // এখানে id যদি String হয়, তবে সরাসরি id পাঠানো যায়। 
    // কিন্তু id যদি Int হয়, তবে parseInt(id) করতে হবে।
    const updatedBranch = await prisma.branch.update({
      where: { id: id }, 
      data: {
        name: formData.name,
        address: formData.address,
        manager: formData.manager,
        geofenceRadius: parseInt(formData.geofenceRadius, 10),
        startTime: formData.startTime,
        endTime: formData.endTime,
        weeklyHolidays: formData.weeklyHolidays,
      },
    });

    revalidatePath('/branches');
    return { success: true, data: updatedBranch };
  } catch (error) {
    console.error('Update Branch Error Details:', error);
    return { success: false, error: error.message || 'Failed to update branch' };
  }
}

// ৫. ব্রাঞ্চ ডিলিট
export async function deleteBranchAction(id) {
  try {
    await prisma.branch.delete({ where: { id: id } });
    revalidatePath('/branches');
    return { success: true };
  } catch (error) {
    console.error('Delete Branch Error:', error);
    return { success: false, error: 'Failed to delete branch' };
  }
}