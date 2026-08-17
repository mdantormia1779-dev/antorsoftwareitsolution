import * as attendanceService from './attendance.service.js';

export const checkIn = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { branchId, checkInFaceVerificationId, checkInGeoVerificationId } = req.body;

    const record = await attendanceService.processCheckIn({
      userId,
      branchId,
      checkInFaceVerificationId,
      checkInGeoVerificationId
    });

    res.status(201).json({
      success: true,
      message: 'Checked in successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

export const checkOut = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { checkOutFaceVerificationId, checkOutGeoVerificationId } = req.body;

    const record = await attendanceService.processCheckOut({
      userId,
      checkOutFaceVerificationId,
      checkOutGeoVerificationId
    });

    res.status(200).json({
      success: true,
      message: 'Checked out successfully',
      data: record
    });
  } catch (error) {
    next(error);
  }
};

export const getMyAttendance = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const records = await attendanceService.fetchUserAttendanceHistory(userId, req.query);

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};

export const getOrganizationAttendance = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const records = await attendanceService.fetchOrgAttendanceOverview(organizationId, req.query);

    res.status(200).json({
      success: true,
      count: records.length,
      data: records
    });
  } catch (error) {
    next(error);
  }
};