import * as userService from './user.service.js';

export const createUser = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const user = await userService.createUserData(organizationId, req.body);

    res.status(201).json({
      success: true,
      message: 'Employee registered successfully',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const users = await userService.fetchUsersByOrg(organizationId, req.query);

    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { id } = req.params;
    const user = await userService.fetchUserById(id, organizationId);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { id } = req.params;
    const updatedUser = await userService.updateUserData(id, organizationId, req.body);

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const { id } = req.params;
    const result = await userService.removeUser(id, organizationId);

    res.status(200).json({
      success: true,
      ...result
    });
  } catch (error) {
    next(error);
  }
};