import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs'; // পাসওয়ার্ড হ্যাশিংয়ের জন্য
// import dbConnect from '@/lib/db';
// import User from '@/models/User';

export async function POST(request) {
  try {
    // await dbConnect();
    const { email, currentPassword, newPassword } = await request.json();

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    // ১. ইউজার খুঁজে বের করা
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
    // }

    // ২. বর্তমান পাসওয়ার্ড ঠিক আছে কিনা যাচাই করা
    // const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    // if (!isPasswordValid) {
    //   return NextResponse.json({ success: false, message: 'Current password is incorrect' }, { status: 400 });
    // }

    // ৩. নতুন পাসওয়ার্ড হ্যাশ করে সেভ করা
    // const hashedPassword = await bcrypt.hash(newPassword, 10);
    // user.password = hashedPassword;
    // await user.save();

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}