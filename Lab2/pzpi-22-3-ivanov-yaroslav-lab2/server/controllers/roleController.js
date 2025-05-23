const { validationResult } = require("express-validator");
const roleService = require("../services/RoleService");
const ApiError = require("../errors/apiError");
const RoleDto = require("../dtos/role-dto");

class roleController {
  async createRole(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const role = await roleService.createRole(req.body.value);
      const roleDto = new RoleDto(role);

      return res.status(200).json(roleDto);
    } catch (e) {
      next(e);
    }
  }

  async getRoleByValue(req, res, next) {
    try {
      const { value } = req.params;
      const role = await roleService.getRoleByValue(value);
      const roleDto = new RoleDto(role);

      return res.status(200).json(roleDto);
    } catch (e) {
      next(e);
    }
  }

  async updateRoleById(req, res, next) {
    try {
      const { id } = req.params;
      const role = await roleService.updateRoleById(id, req.body.value);
      const roleDto = new RoleDto(role);

      return res.status(200).json(roleDto);
    } catch (e) {
      next(e);
    }
  }

  async deleteRoleById(req, res, next) {
    try {
      const { id } = req.params;
      await roleService.deleteRoleById(id);

      return res.status(200).json({ message: "Role successfully deleted" });
    } catch (e) {
      next(e);
    }
  }

  async getAllRoles(req, res, next) {
    try {
      const roles = await roleService.getAllRoles();
      const rolesDto = roles.map((role) => new RoleDto(role));

      return res.status(200).json(rolesDto);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new roleController();
