import mongoose from 'mongoose';

const EmployeeSchema = new mongoose.Schema(
  {
    empCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    pin: {
      type: String,
      required: true, // সিকিউরিটির জন্য ডেটাবেজে সেভ করার আগে bcrypt দিয়ে হ্যাশ করে নেবেন
    },
    branch: {
      type: String,
      required: true,
    },
    systemRole: {
      type: String,
      enum: ['employee', 'manager', 'admin'],
      default: 'employee',
    },
    designation: {
      type: String,
      required: true,
    },
    department: {
      type: String,
      required: true,
    },
    joiningDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Active', 'Inactive'],
      default: 'Active',
    },
    avatar: {
      type: String,
      default: null,
    },
    avatarColor: {
      type: String,
    },
    initials: {
      type: String,
    },
    faceStatus: {
      type: String,
      default: 'Verified',
    },
  },
  {
    timestamps: true, // createdAt এবং updatedAt স্বয়ংক্রিয়ভাবে তৈরি হবে
  }
);

export default mongoose.models.Employee ||
  mongoose.model('Employee', EmployeeSchema);