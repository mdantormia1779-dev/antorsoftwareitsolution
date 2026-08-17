import * as verificationService from './verification.service.js';

export const verifyGeo = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { branchId, latitude, longitude, verificationType } = req.body;

    const result = await verificationService.verifyGeoLocation({
      userId,
      branchId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      verificationType
    });

    res.status(200).json({
      success: true,
      message: result.withinGeofence ? 'Geofence verification successful.' : 'Outside allowed geofence radius.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const verifyFace = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { similarityScore, imageUrl, verificationType } = req.body;
    const ipAddress = req.ip || req.headers['x-forwarded-for'];
    const deviceInfo = req.headers['user-agent'];

    const result = await verificationService.verifyFaceMatch({
      userId,
      similarityScore: parseFloat(similarityScore),
      imageUrl,
      deviceInfo,
      ipAddress,
      verificationType
    });

    res.status(200).json({
      success: true,
      message: result.status === 'VERIFIED' ? 'Face verification passed.' : 'Face verification failed.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

export const getPendingQueue = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const queues = await verificationService.fetchPendingQueues(organizationId);

    res.status(200).json({
      success: true,
      count: queues.length,
      data: queues
    });
  } catch (error) {
    next(error);
  }
};

export const decideVerificationQueue = async (req, res, next) => {
  try {
    const managerId = req.user.id;
    const { id } = req.params;
    const { status, comment } = req.body;

    const result = await verificationService.resolveVerificationQueue({
      queueId: id,
      managerId,
      status,
      comment
    });

    res.status(200).json({
      success: true,
      message: `Verification queue successfully marked as ${status}`,
      data: result
    });
  } catch (error) {
    next(error);
  }
};