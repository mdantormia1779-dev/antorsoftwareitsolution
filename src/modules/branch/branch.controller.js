import * as branchService from "./branch.service.js";

export const createBranch = async (req, res, next) => {
  try {
    const result = await branchService.createBranchData(req.body);
    return res.status(201).json({
      success: true,
      message: "Branch created successfully",
      data: result,
    });
  } catch (error) {
    // প্রিজমার ইউনিক কনস্ট্রেইন্ট ভায়োলেশন কোড হলো 'P2002'
    if (error.code === "P2002" && error.meta?.target?.includes("managerId")) {
      return res.status(400).json({
        success: false,
        message: "Manager already assigned to another branch.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong.",
    });
  }
};

export const getAllBranches = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const branches = await branchService.fetchBranchesByOrg(organizationId);

    res.status(200).json({
      success: true,
      count: branches.length,
      data: branches,
    });
  } catch (error) {
    next(error);
  }
};

export const getBranchById = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { id } = req.params;
    const branch = await branchService.fetchBranchById(id, organizationId);

    res.status(200).json({
      success: true,
      data: branch,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBranch = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { id } = req.params;
    
    // সার্ভিস ফাইলের স্ট্রাকচার অনুযায়ী id এবং data (organizationId সহ) পাস করা হলো
    const updatedBranch = await branchService.updateBranchData(id, {
      ...req.body,
      organizationId,
    });

    res.status(200).json({
      success: true,
      message: "Branch updated successfully",
      data: updatedBranch,
    });
  } catch (error) {
    // আপডেট করার সময়ও যদি ম্যানেজার অলরেডি অ্যাসাইনড থাকে
    if (error.code === "P2002" && error.meta?.target?.includes("managerId")) {
      return res.status(400).json({
        success: false,
        message: "Manager already assigned to another branch.",
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong.",
    });
  }
};

export const deleteBranch = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { id } = req.params;
    const result = await branchService.removeBranch(id, organizationId);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};