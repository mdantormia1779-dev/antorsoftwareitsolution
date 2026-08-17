import * as reportService from './report.service.js';

export const getAttendanceReport = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const report = await reportService.generateAttendanceReportData(organizationId, req.query);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getPayrollReport = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const report = await reportService.generatePayrollReportData(organizationId, req.query);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaveReport = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const report = await reportService.generateLeaveReportData(organizationId, req.query);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};

export const getHeadcountReport = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const report = await reportService.generateHeadcountReportData(organizationId);

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (error) {
    next(error);
  }
};