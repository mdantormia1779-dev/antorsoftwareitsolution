import prisma from '../../config/prisma.js';
import { calculateDistanceInMeters } from '../../utils/geofence.js';

export const verifyGeoLocation = async ({ userId, branchId, latitude, longitude, verificationType }) => {
  const branch = await prisma.branch.findUnique({
    where: { id: branchId }
  });

  if (!branch || branch.latitude === null || branch.longitude === null) {
    const error = new Error('Branch location coordinates are not configured.');
    error.statusCode = 400;
    throw error;
  }

  const distanceInMeters = calculateDistanceInMeters(
    latitude,
    longitude,
    branch.latitude,
    branch.longitude
  );

  const withinGeofence = distanceInMeters <= branch.geofenceRadius;
  const status = withinGeofence ? 'VERIFIED' : 'OUTSIDE_GEOFENCE';

  const geoVerification = await prisma.geoVerification.create({
    data: {
      userId,
      branchId,
      verificationType: verificationType || 'CHECK_IN',
      latitude,
      longitude,
      branchLatitude: branch.latitude,
      branchLongitude: branch.longitude,
      distanceInMeters,
      allowedRadiusInMeters: branch.geofenceRadius,
      withinGeofence,
      status
    }
  });

  return geoVerification;
};

export const verifyFaceMatch = async ({ userId, similarityScore, imageUrl, deviceInfo, ipAddress, verificationType }) => {
  // Threshold for face match success (e.g., 0.85 or 85% similarity)
  const threshold = 0.85;
  const isVerified = similarityScore >= threshold;
  const status = isVerified ? 'VERIFIED' : 'FAILED';

  const faceVerification = await prisma.faceVerification.create({
    data: {
      userId,
      verificationType: verificationType || 'CHECK_IN',
      similarityScore,
      status,
      imageUrl,
      deviceInfo,
      ipAddress
    }
  });

  return faceVerification;
};

export const createVerificationQueueItem = async ({ userId, branchId, attendanceId, reason, faceVerificationId, geoVerificationId }) => {
  const queueItem = await prisma.verificationQueue.create({
    data: {
      userId,
      branchId,
      attendanceId,
      reason,
      status: 'PENDING',
      ...(faceVerificationId && { faceVerificationId }),
      ...(geoVerificationId && { geoVerificationId })
    },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true } },
      branch: { select: { id: true, name: true } }
    }
  });

  return queueItem;
};

export const fetchPendingQueues = async (organizationId) => {
  return await prisma.verificationQueue.findMany({
    where: {
      status: 'PENDING',
      branch: { organizationId }
    },
    include: {
      user: { select: { id: true, fullName: true, employeeId: true } },
      branch: { select: { id: true, name: true } },
      faceVerification: true,
      geoVerification: true
    },
    orderBy: { createdAt: 'asc' }
  });
};

export const resolveVerificationQueue = async ({ queueId, managerId, status, comment }) => {
  const queueItem = await prisma.verificationQueue.findUnique({
    where: { id: queueId }
  });

  if (!queueItem) {
    const error = new Error('Verification queue item not found.');
    error.statusCode = 404;
    throw error;
  }

  const updatedQueue = await prisma.verificationQueue.update({
    where: { id: queueId },
    data: {
      status, // APPROVED or REJECTED
      managerId,
      comment,
      decidedAt: new Date()
    },
    include: {
      attendance: true,
      user: { select: { id: true, fullName: true, email: true } }
    }
  });

  // If approved, update associated attendance record status if needed
  if (status === 'APPROVED' && updatedQueue.attendanceId) {
    await prisma.attendance.update({
      where: { id: updatedQueue.attendanceId },
      data: { status: 'PRESENT' }
    });
  }

  return updatedQueue;
};