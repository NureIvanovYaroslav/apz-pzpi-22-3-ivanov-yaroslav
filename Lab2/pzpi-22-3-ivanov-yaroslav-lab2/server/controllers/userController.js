const { validationResult } = require("express-validator");
const userService = require("../services/UserService");
const actionLogService = require("../services/LogService");
const ApiError = require("../errors/apiError");
const UserDto = require("../dtos/user-dto");

class userController {
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      const userDto = new UserDto(user);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get user by id: ${id}`,
        success: true,
      });

      return res.status(200).json(userDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get user by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async editPersonalData(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        actionLogService.log({
          userId: req.user?.id || "unknown",
          description: "Edit personal data (validation error)",
          success: false,
        });
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { id } = req.params;
      const user = await userService.editPersonalData(id, req.body);
      const userDto = new UserDto(user);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Edit personal data for user id: ${id}`,
        success: true,
      });

      return res.status(200).json(userDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Edit personal data for user id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async deleteUserById(req, res, next) {
    const { id } = req.params;
    try {
      await userService.deleteUserById(id);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete user by id: ${id}`,
        success: true,
      });

      return res.status(200).json({ message: "User successfully deleted" });
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete user by id: ${id}`,
        success: false,
      });
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      const usersDto = users.map((user) => new UserDto(user));

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all users",
        success: true,
      });

      return res.status(200).json(usersDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all users",
        success: false,
      });
      next(e);
    }
  }

  async addUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const result = await userService.addUserRole(id, role);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Add role '${role}' to user id: ${id}`,
        success: true,
      });

      return res.status(200).json(result);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Add role to user id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async deleteUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const result = await userService.deleteUserRole(id, role);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete role '${role}' from user id: ${id}`,
        success: true,
      });

      return res.status(200).json(result);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete role from user id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }
}

module.exports = new userController();
