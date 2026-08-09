"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// ১. সব এমপ্লয়ি ডাটা নিয়ে আসা
export async function getEmployeesAction() {
  try {
    const rawEmployees = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        branchRef: true,
        attendances: {
          take: 1,
          orderBy: { date: "desc" },
        },
      },
    });

    const formattedEmployees = rawEmployees.map((emp) => ({
      ...emp,
      name: emp.fullName,
      status: emp.status === "ACTIVE" ? "Active" : "Inactive",
    }));

    return {
      success: true,
      data: JSON.parse(JSON.stringify(formattedEmployees)),
    };
  } catch (error) {
    console.error("Fetch Employees Error:", error);
    return { success: false, error: "Failed to fetch employees." };
  }
}

// ২. নতুন এমপ্লয়ি যোগ করা (Server Action)
export async function addEmployeeAction(newEmployeeData) {
  try {
    const {
      empCode,
      fullName,
      name,
      email,
      phone,
      companyName,
      pin,
      role,
      branchId,
      department,
      designation,
      joiningDate,
      status,
      avatar,
      avatarColor,
      initials,
    } = newEmployeeData;

    const resolvedFullName = fullName || name;

    if (!email || !empCode || !resolvedFullName || !phone || !pin) {
      return { success: false, error: "Required fields are missing." };
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { empCode }],
      },
    });

    if (existingUser) {
      const message =
        existingUser.email === email
          ? "An employee with this Email already exists."
          : "An employee with this Employee ID already exists.";
      return { success: false, error: message };
    }

    const hashedPin = await bcrypt.hash(pin.toString(), 10);

    // স্ট্যাটাস হ্যান্ডলিং (Active/Inactive থেকে Status Enum এ রূপান্তর)
    const statusEnum =
      status?.toString().toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE";
      
    const formattedRole = role ? role.toUpperCase() : "EMPLOYEE";
    
    // ব্রাঞ্চ আইডি নিশ্চিত করা (যদি ফাঁকা স্ট্রিং হয় তবে null করা)
    const finalBranchId = branchId && branchId !== "" ? branchId : null;

    const newEmployee = await prisma.user.create({
      data: {
        empCode: empCode || `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        fullName: resolvedFullName,
        email,
        phone: phone || null,
        pin: hashedPin,
        role: formattedRole,
        companyName: companyName || "Antor Software & IT Solution",
        branchId: finalBranchId,
        department: department || "Engineering",
        designation: designation || "Frontend Developer",
        joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
        status: statusEnum,
        avatar: avatar || null,
        avatarColor: avatarColor || "bg-indigo-600",
        initials: initials || "EM",
      },
      include: {
        branchRef: true,
      },
    });

    revalidatePath("/admin/employees");

    const { pin: _, ...employeeWithoutPin } = newEmployee;

    const formattedData = {
      ...employeeWithoutPin,
      name: employeeWithoutPin.fullName,
      status: employeeWithoutPin.status === "ACTIVE" ? "Active" : "Inactive",
    };

    return { success: true, data: JSON.parse(JSON.stringify(formattedData)) };
  } catch (error) {
    console.error("Add Employee Error:", error);

    if (error.code === "P2003") {
      return {
        success: false,
        error: "Invalid Branch ID provided. The selected branch does not exist.",
      };
    }

    return {
      success: false,
      error: error.message || "Failed to create employee.",
    };
  }
}

// ৩. এমপ্লয়ি ডাটা আপডেট করা
export async function updateEmployeeAction(id, updatedData) {
  try {
    const employeeId = id || updatedData.id || updatedData._id;

    if (!employeeId) {
      return { success: false, error: "Employee ID is missing!" };
    }

    // স্ট্যাটাস স্ট্রিং ফিক্স (Active -> ACTIVE অথবা Inactive -> INACTIVE)
    let rawStatus = updatedData.status;
    if (rawStatus) {
      rawStatus = rawStatus.toString().toUpperCase();
      if (rawStatus === "ACTIVE" || rawStatus === "INACTIVE") {
        rawStatus = rawStatus;
      } else {
        rawStatus = "ACTIVE";
      }
    } else {
      rawStatus = "ACTIVE";
    }

    const updatedEmployee = await prisma.user.update({
      where: { id: employeeId },
      data: {
        fullName: updatedData.fullName || updatedData.name,
        email: updatedData.email,
        phone: updatedData.phone,
        empCode: updatedData.empCode,
        designation: updatedData.designation,
        branchId: updatedData.branchId && updatedData.branchId !== "" ? updatedData.branchId : null,
        role: updatedData.role ? updatedData.role.toUpperCase() : undefined,
        department: updatedData.department,
        joiningDate: updatedData.joiningDate
          ? new Date(updatedData.joiningDate)
          : undefined,
        status: rawStatus,
        avatar: updatedData.avatar,
      },
      include: {
        branchRef: true,
      },
    });

    revalidatePath("/admin/employees");

    const formattedData = {
      ...updatedEmployee,
      name: updatedEmployee.fullName,
      status: updatedEmployee.status === "ACTIVE" ? "Active" : "Inactive",
    };

    return { success: true, data: JSON.parse(JSON.stringify(formattedData)) };
  } catch (error) {
    console.error("Update Employee Error:", error);
    return {
      success: false,
      error: error.message || "Failed to update employee",
    };
  }
}

// ৪. এমপ্লয়ি স্ট্যাটাস টগল
export async function toggleEmployeeStatusAction(id, status) {
  try {
    const statusEnum =
      status?.toString().toUpperCase() === "INACTIVE" ? "INACTIVE" : "ACTIVE";

    const updatedEmployee = await prisma.user.update({
      where: { id },
      data: { status: statusEnum },
      include: {
        branchRef: true,
      },
    });

    revalidatePath("/admin/employees");
    
    const formattedData = {
      ...updatedEmployee,
      name: updatedEmployee.fullName,
      status: updatedEmployee.status === "ACTIVE" ? "Active" : "Inactive",
    };

    return { success: true, data: JSON.parse(JSON.stringify(formattedData)) };
  } catch (error) {
    console.error("Toggle Status Error:", error);
    return { success: false, error: error.message };
  }
}

// ৫. এমপ্লয়ি ডিলিಟ್ করা
export async function deleteEmployeeAction(id) {
  try {
    await prisma.user.delete({
      where: { id },
    });

    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error) {
    console.error("Delete Employee Error:", error);
    return { success: false, error: error.message };
  }
}