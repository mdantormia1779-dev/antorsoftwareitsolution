import * as performanceService from './performance.service.js';

export const createReview = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const reviewerId = req.user.id;
    const review = await performanceService.createPerformanceReviewData(organizationId, reviewerId, req.body);

    res.status(201).json({
      success: true,
      message: 'Performance review created successfully',
      data: review
    });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const reviews = await performanceService.fetchPerformanceReviewsByOrg(organizationId, req.query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { id } = req.params;
    const updated = await performanceService.updatePerformanceReviewData(id, organizationId, req.body);

    res.status(200).json({
      success: true,
      message: 'Performance review updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

export const createKpi = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const kpi = await performanceService.createOrUpdateKpiData(organizationId, req.body);

    res.status(201).json({
      success: true,
      message: 'KPI created successfully',
      data: kpi
    });
  } catch (error) {
    next(error);
  }
};

export const getMyKpis = async (req, res, next) => {
  try {
    const userId = req.params.userId || req.user.id;
    const kpis = await performanceService.fetchUserKpis(userId);

    res.status(200).json({
      success: true,
      count: kpis.length,
      data: kpis
    });
  } catch (error) {
    next(error);
  }
};