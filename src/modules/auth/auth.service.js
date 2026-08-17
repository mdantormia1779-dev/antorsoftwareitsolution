import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma, { pool } from '../../config/prisma.js';
import { ENV } from '../../config/env.js';

export const loginUser = async ({ email, password, ipAddress, device }) => {
  if (!email || !password || typeof email !== 'string') {
    const error = new Error('Email and password are required and must be valid text.');
    error.statusCode = 400;
    throw error;
  }

  const sanitizedEmail = email.toLowerCase().trim();

  // সরাসরি pg pool দিয়ে ডেটাবেজ থেকে ইউজার ফেচ করা (প্রিজমা অ্যাডাপ্টারের ঝামেলা এড়াতে)
  const queryResult = await pool.query(
    `SELECT * FROM "users" WHERE LOWER(email) = $1 LIMIT 1`,
    [sanitizedEmail]
  );
  const user = queryResult.rows[0] || null;

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // Fetch organization data if needed
  let organization = null;
  if (user.organizationId) {
    const orgResult = await pool.query(
      `SELECT * FROM "organizations" WHERE id = $1 LIMIT 1`,
      [user.organizationId]
    );
    organization = orgResult.rows[0] || null;
  }

  // Check if account is locked or inactive
  if (user.accountLocked || user.status !== 'ACTIVE') {
    const error = new Error('Account is locked, suspended, or inactive. Contact admin.');
    error.statusCode = 403;
    throw error;
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password || '');
  if (!isPasswordValid) {
    // Increment failed login attempts
    await pool.query(
      `UPDATE "users" SET "failedLoginAttempts" = "failedLoginAttempts" + 1 WHERE id = $1`,
      [user.id]
    );

    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  // Reset failed login attempts on successful login & update last login
  await pool.query(
    `UPDATE "users" SET "failedLoginAttempts" = 0, "lastLogin" = NOW() WHERE id = $1`,
    [user.id]
  );

  // Generate JWT Token
  const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role, organizationId: user.organizationId },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN || '7d' }
  );

  // Create Session record (expires in 7 days)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.session.create({
    data: {
      userId: user.id,
      token,
      ipAddress: ipAddress || '127.0.0.1',
      device: device || 'Unknown',
      expiresAt
    }
  });

  // Exclude password from returned user object
  const { password: _, ...userWithoutPassword } = user;

  return { token, user: userWithoutPassword, organization };
};

export const logoutUser = async (token) => {
  if (!token) {
    const error = new Error('Token is required for logout.');
    error.statusCode = 400;
    throw error;
  }

  await prisma.session.deleteMany({
    where: { token }
  });
  
  return { message: 'Logged out successfully' };
};

export const requestPasswordReset = async (email) => {
  if (!email || typeof email !== 'string') {
    const error = new Error('A valid email is required.');
    error.statusCode = 400;
    throw error;
  }

  const sanitizedEmail = email.toLowerCase().trim();
  const queryResult = await pool.query(
    `SELECT * FROM "users" WHERE LOWER(email) = $1 LIMIT 1`,
    [sanitizedEmail]
  );
  const user = queryResult.rows[0] || null;

  if (!user) {
    return { message: 'If the email exists, a password reset OTP has been sent.' };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.passwordReset.create({
    data: {
      userId: user.id,
      otp,
      expiresAt
    }
  });

  return { message: 'Password reset OTP generated successfully.', debugOtp: otp };
};

export const resetPasswordWithOtp = async ({ email, otp, newPassword }) => {
  if (!email || !otp || !newPassword) {
    const error = new Error('Email, OTP, and new password are required.');
    error.statusCode = 400;
    throw error;
  }

  const sanitizedEmail = email.toLowerCase().trim();
  const queryResult = await pool.query(
    `SELECT * FROM "users" WHERE LOWER(email) = $1 LIMIT 1`,
    [sanitizedEmail]
  );
  const user = queryResult.rows[0] || null;

  if (!user) {
    const error = new Error('Invalid email or OTP.');
    error.statusCode = 400;
    throw error;
  }

  const resetRecord = await prisma.passwordReset.findFirst({
    where: {
      userId: user.id,
      otp,
      used: false,
      expiresAt: { gte: new Date() }
    }
  });

  if (!resetRecord) {
    const error = new Error('Invalid or expired OTP.');
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, failedLoginAttempts: 0, accountLocked: false }
    }),
    prisma.passwordReset.update({
      where: { id: resetRecord.id },
      data: { used: true }
    }),
    prisma.session.deleteMany({
      where: { userId: user.id }
    })
  ]);

  return { message: 'Password reset successful. Please log in with your new password.' };
};

export const registerAdmin = async ({ fullName, email, password }) => {
  if (!fullName || !email || !password) {
    const error = new Error('Full name, email, and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const sanitizedEmail = email.toLowerCase().trim();

  try {
    // ১. চেক করা ইমেইলটি ইতিমধ্যে ডাটাবেজে আছে কিনা
    const existingUser = await prisma.user.findFirst({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      const error = new Error('Email is already registered.');
      error.statusCode = 400;
      throw error;
    }

    // ২. সিড ফাইলের মতো অর্গানাইজেশন খুঁজে বের করা
    // যদি ডাটাবেজে অর্গানাইজেশন না থাকে, তবে ডিফল্ট একটি তৈরি হবে
    let org = await prisma.organization.findFirst();
    if (!org) {
      org = await prisma.organization.create({
        data: { name: 'Antor Software' }
      });
    }

    // ৩. পাসওয়ার্ড হ্যাশ করা
    const hashedPassword = await bcrypt.hash(password, 10);

    // ৪. ইউনিক এমপ্লয়ি আইডি জেনারেট করা (যেমন সিডিং ফাইলে EMP-001 এর মতো ফরম্যাট)
    // সিডিং ফাইলের লজিক অনুসরণ করে একটি ইউনিক আইডি তৈরি করা হচ্ছে
    const generatedEmployeeId = `EMP-${Date.now().toString().slice(-6)}`;

    // ৫. Prisma দিয়ে নতুন অ্যাডমিন ইউজার তৈরি করা (সিড ফাইলের ডাটা স্ট্রাকচার অনুযায়ী)
    const newUser = await prisma.user.create({
      data: {
        email: sanitizedEmail,
        password: hashedPassword,
        fullName: fullName,
        employeeId: generatedEmployeeId, // সিডিং ফাইলের মতো এখানেও এটি দরকার
        role: 'SUPER_ADMIN',
        organizationId: org.id,
        status: 'ACTIVE'
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      }
    });

    return {
      success: true,
      statusCode: 201,
      message: 'Admin account created successfully.',
      data: newUser,
    };
  } catch (error) {
    console.error('Register Admin Error:', error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

export const updateAdminProfile = async ({ id, fullName, companyName, password }) => {
  if (!id) {
    const error = new Error('User ID is required.');
    error.statusCode = 400;
    throw error;
  }

  // ১. ইউজার খুঁজে বের করা
  const userResult = await pool.query(`SELECT * FROM "users" WHERE id = $1 LIMIT 1`, [id]);
  const user = userResult.rows[0];

  if (!user) {
    const error = new Error('User not found.');
    error.statusCode = 404;
    throw error;
  }

  // ২. পাসওয়ার্ড পরিবর্তন করা হলে তা হ্যাশ করা
  let updatedPassword = user.password;
  if (password && password.trim() !== '') {
    updatedPassword = await bcrypt.hash(password, 10);
  }

  // ৩. ইউজারের ফুল নেম ও পাসওয়ার্ড আপডেট করা
  const updatedUserQuery = await pool.query(
    `UPDATE "users" SET "fullName" = $1, "password" = $2, "updatedAt" = NOW() WHERE id = $3 RETURNING *`,
    [fullName, updatedPassword, user.id]
  );
  const updatedUser = updatedUserQuery.rows[0];

  // ৪. অর্গানাইজেশনের নাম (companyName) আপডেট করা (যদি organizationId থাকে)
  let organizationName = '';
  if (user.organizationId) {
    if (companyName) {
      const orgQuery = await pool.query(
        `UPDATE "organizations" SET name = $1, "updatedAt" = NOW() WHERE id = $2 RETURNING name`,
        [companyName, user.organizationId]
      );
      organizationName = orgQuery.rows[0]?.name || '';
    } else {
      const orgQuery = await pool.query(
        `SELECT name FROM "organizations" WHERE id = $1 LIMIT 1`,
        [user.organizationId]
      );
      organizationName = orgQuery.rows[0]?.name || '';
    }
  }

  const { password: _, ...userWithoutPassword } = updatedUser;

  return {
    success: true,
    message: 'Profile updated successfully',
    data: {
      ...userWithoutPassword,
      companyName: organizationName, // ফ্রন্টএন্ডের সুবিধার জন্য companyName যুক্ত করে পাঠানো হলো
    }
  };
};