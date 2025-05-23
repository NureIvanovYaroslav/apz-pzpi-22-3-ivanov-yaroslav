const { validationResult } = require("express-validator");
const userService = require("../services/UserService");
const ApiError = require("../errors/apiError");
const UserDto = require("../dtos/user-dto");

class userController {
  async getUserById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      const userDto = new UserDto(user);

      return res.status(200).json(userDto);
    } catch (e) {
      next(e);
    }
  }

  async editPersonalData(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { id } = req.params;
      const user = await userService.editPersonalData(id, req.body);
      const userDto = new UserDto(user);

      return res.status(200).json(userDto);
    } catch (e) {
      next(e);
    }
  }

  async deleteUserById(req, res, next) {
    const { id } = req.params;
    try {
      await userService.deleteUserById(id);

      return res.status(200).json({ message: "User successfully deleted" });
    } catch (e) {
      next(e);
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await userService.getAllUsers();
      const usersDto = users.map((user) => new UserDto(user));

      return res.status(200).json(usersDto);
    } catch (e) {
      next(e);
    }
  }

  async addUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const result = await userService.addUserRole(id, role);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }

  async deleteUserRole(req, res, next) {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const result = await userService.deleteUserRole(id, role);

      return res.status(200).json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new userController();
