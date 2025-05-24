const { validationResult } = require("express-validator");
const roleService = require("../services/RoleService");
const actionLogService = require("../services/LogService");
const ApiError = require("../errors/apiError");
const RoleDto = require("../dtos/role-dto");

class roleController {
  async createRole(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        actionLogService.log({
          userId: req.user?.id || "unknown",
          description: "Create role (validation error)",
          success: false,
        });
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const role = await roleService.createRole(req.body.value);
      const roleDto = new RoleDto(role);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create role",
        success: true,
      });

      return res.status(200).json(roleDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create role",
        success: false,
      });
      next(e);
    }
  }

  async getRoleByValue(req, res, next) {
    try {
      const { value } = req.params;
      const role = await roleService.getRoleByValue(value);
      const roleDto = new RoleDto(role);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get role by value: ${value}`,
        success: true,
      });

      return res.status(200).json(roleDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get role by value: ${req.params.value}`,
        success: false,
      });
      next(e);
    }
  }

  async updateRoleById(req, res, next) {
    try {
      const { id } = req.params;
      const role = await roleService.updateRoleById(id, req.body.value);
      const roleDto = new RoleDto(role);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update role by id: ${id}`,
        success: true,
      });

      return res.status(200).json(roleDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update role by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async deleteRoleById(req, res, next) {
    try {
      const { id } = req.params;
      await roleService.deleteRoleById(id);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete role by id: ${id}`,
        success: true,
      });

      return res.status(200).json({ message: "Role successfully deleted" });
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete role by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async getAllRoles(req, res, next) {
    try {
      const roles = await roleService.getAllRoles();
      const rolesDto = roles.map((role) => new RoleDto(role));

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all roles",
        success: true,
      });

      return res.status(200).json(rolesDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all roles",
        success: false,
      });
      next(e);
    }
  }
}

module.exports = new roleController();
