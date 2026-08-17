import prisma from '../../config/prisma.js';

export const getUserNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const createNotification = async (req, res, next) => {
  try {
    const { title, message, priority, userId, type, actionUrl, imageUrl } = req.body;

    const newNotification = await prisma.notification.create({
      data: {
        title,
        message,
        priority: priority || 'MEDIUM',
        userId: userId || req.user.id,
        type: type || 'SYSTEM',
        actionUrl: actionUrl || null,
        imageUrl: imageUrl || null,
      },
    });

    res.status(201).json({
      success: true,
      data: newNotification,
      message: 'Notification created successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const updateNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, message, priority, type, actionUrl, imageUrl, isRead } = req.body;

    const updatedNotification = await prisma.notification.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(message && { message }),
        ...(priority && { priority }),
        ...(type && { type }),
        ...(actionUrl !== undefined && { actionUrl }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isRead !== undefined && { isRead }),
      },
    });

    res.status(200).json({
      success: true,
      data: updatedNotification,
      message: 'Notification updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    await prisma.notification.delete({
      where: { id },
    });

    res.status(200).json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};