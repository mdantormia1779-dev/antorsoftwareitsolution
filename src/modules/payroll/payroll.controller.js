import * as payrollService from './payroll.service.js';

export const upsertSalaryStructure = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const structure = await payrollService.upsertSalaryStructureData(organizationId, req.body);

    res.status(200).json({
      success: true,
      message: 'Salary structure saved successfully',
      data: structure
    });
  } catch (error) {
    next(error);
  }
};

export const getSalaryStructure = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const userId = req.params.userId || req.user.id;
    const structure = await payrollService.fetchSalaryStructureByUserId(userId, organizationId);

    res.status(200).json({
      success: true,
      data: structure
    });
  } catch (error) {
    next(error);
  }
};

export const generatePayroll = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const result = await payrollService.generateMonthlyPayrollData(organizationId, req.body);

    res.status(201).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};

export const getPayrolls = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const payrolls = await payrollService.fetchPayrollsByOrg(organizationId, req.query);

    res.status(200).json({
      success: true,
      count: payrolls.length,
      data: payrolls
    });
  } catch (error) {
    next(error);
  }
};

export const updatePayrollStatus = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { id } = req.params;
    const { status } = req.body;

    const updated = await payrollService.updatePayrollPaymentStatus(id, organizationId, status);

    res.status(200).json({
      success: true,
      message: `Payroll status successfully updated to ${status}`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};