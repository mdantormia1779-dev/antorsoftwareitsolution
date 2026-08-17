import * as shiftService from './shift.service.js';

export const createShift = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const shift = await shiftService.createShiftData(organizationId, req.body);

    res.status(201).json({
      success: true,
      message: 'Shift created successfully',
      data: shift
    });
  } catch (error) {
    next(error);
  }
};

export const getAllShifts = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const shifts = await shiftService.fetchShiftsByOrg(organizationId);

    res.status(200).json({
      success: true,
      count: shifts.length,
      data: shifts
    });
  } catch (error) {
    next(error);
  }
};

export const updateShift = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { id } = req.params;
    const updatedShift = await shiftService.updateShiftData(id, organizationId, req.body);

    res.status(200).json({
      success: true,
      message: 'Shift updated successfully',
      data: updatedShift
    });
  } catch (error) {
    next(error);
  }
};

export const assignShiftToEmployee = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const assignment = await shiftService.assignEmployeeShiftData(organizationId, req.body);

    res.status(201).json({
      success: true,
      message: 'Shift successfully assigned to employee',
      data: assignment
    });
  } catch (error) {
    next(error);
  }
};

export const getMyShiftHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const history = await shiftService.fetchEmployeeShiftHistory(userId);

    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    next(error);
  }
};