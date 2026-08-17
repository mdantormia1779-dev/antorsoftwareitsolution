import * as leaveService from './leave.service.js';

export const createLeavePolicy = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const policy = await leaveService.createLeavePolicyData(organizationId, req.body);

    res.status(201).json({
      success: true,
      message: 'Leave policy created successfully',
      data: policy
    });
  } catch (error) {
    next(error);
  }
};

export const getLeavePolicies = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const policies = await leaveService.fetchLeavePolicies(organizationId);

    res.status(200).json({
      success: true,
      count: policies.length,
      data: policies
    });
  } catch (error) {
    next(error);
  }
};

export const getMyLeaveBalances = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const balances = await leaveService.fetchUserLeaveBalances(userId, req.query.year);

    res.status(200).json({
      success: true,
      data: balances
    });
  } catch (error) {
    next(error);
  }
};

export const applyForLeave = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const organizationId = req.user.organizationId;
    const request = await leaveService.submitLeaveRequestData(userId, organizationId, req.body);

    res.status(201).json({
      success: true,
      message: 'Leave application submitted successfully',
      data: request
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaveRequests = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const requests = await leaveService.fetchLeaveRequestsByOrg(organizationId, req.query);

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    next(error);
  }
};

export const decideLeaveRequest = async (req, res, next) => {
  try {
    const approverId = req.user.id;
    const { id } = req.params;
    const { status, rejectionReason } = req.body;

    const result = await leaveService.updateLeaveRequestStatus({
      requestId: id,
      approverId,
      status,
      rejectionReason
    });

    res.status(200).json({
      success: true,
      message: `Leave request successfully ${status.toLowerCase()}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};