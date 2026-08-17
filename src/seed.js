import './config/env.js'; // 🔴 এটি সবার উপরে থাকতে হবে যাতে .env ফাইল লোড হয়
import prisma from './config/prisma.js';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Seeding database...');

  // ১. একটি অর্গানাইজেশন তৈরি বা খুঁজে নেওয়া
  // ১. একটি অর্গানাইজেশন তৈরি বা খুঁজে নেওয়া
  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: 'Antor Software' // শুধু name দিলেই হবে, slug বাদ দেওয়া হলো
      }
    });
    console.log('✅ Organization created:', org.name);
  } else {
    console.log('ℹ️ Organization already exists:', org.name);
  }

  // ২. পাসওয়ার্ড হ্যাশ করা ('123456')
  const hashedPassword = await bcrypt.hash('123456', 10);

  // ৩. টেস্ট ইউজার তৈরি করা
  const existingUser = await prisma.user.findFirst({
    where: { email: 'admin@gmail.com' }
  });

  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        email: 'admin@gmail.com',
        password: hashedPassword,
        fullName: 'Admin User',
        employeeId: 'EMP-001',
        role: 'SUPER_ADMIN',
        organizationId: org.id,
        status: 'ACTIVE'
      }
    });
    console.log('✅ Test User Created Successfully:', user.email);
  } else {
    console.log('ℹ️ Test User already exists: admin@gmail.com');
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });