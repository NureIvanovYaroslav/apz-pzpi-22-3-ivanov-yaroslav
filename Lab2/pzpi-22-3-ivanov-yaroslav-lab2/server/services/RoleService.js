const RoleModel = require("../models/Role");
const UserModel = require("../models/User");
const ApiError = require("../errors/apiError");

class RoleService {
  /**
   * Creates a new role.
   * @param {string} value - The role value.
   * @returns {Promise<Object>} - The created role.
   */
  async createRole(value) {
    if (!value) {
      throw ApiError.BadRequest("Role value cannot be empty");
    }

    const existingRole = await RoleModel.findOne({ value });

    if (existingRole) {
      throw ApiError.BadRequest("Role with this value already exists");
    }

    const role = new RoleModel({ value });

    await role.save();

    return role;
  }

  /**
   * Retrieves a role by its value.
   * @param {string} value - The role value.
   * @returns {Promise<Object>} - The role data.
   */
  async getRoleByValue(value) {
    const role = await RoleModel.findOne({ value });

    if (!role) {
      throw ApiError.NotFound("Role not found");
    }

    return role;
  }

  /**
   * Updates a role by its ID.
   * @param {string} id - The role ID.
   * @param {string} newValue - The new role value.
   * @returns {Promise<Object>} - The updated role.
   */
  async updateRoleById(id, newValue) {
    if (!newValue) {
      throw ApiError.BadRequest("Role value cannot be empty");
    }

    const role = await RoleModel.findByIdAndUpdate(
      id,
      { value: newValue },
      { new: true }
    );

    if (!role) {
      throw ApiError.NotFound("Role not found");
    }

    return role;
  }

  /**
   * Deletes a role by its ID.
   * @param {string} id - The role ID.
   * @returns {Promise<Object>} - The deleted role.
   */
  async deleteRoleById(id) {
    const role = await RoleModel.findByIdAndDelete(id);

    if (!role) {
      throw ApiError.NotFound("Role not found");
    }

    await UserModel.updateMany(
      { roles: role.value },
      { $pull: { roles: role.value } }
    );

    return role;
  }

  /**
   * Retrieves all roles.
   * @returns {Promise<Array>} - The list of roles.
   */
  async getAllRoles() {
    const roles = await RoleModel.find();

    if (roles.length === 0) {
      throw ApiError.NotFound("No roles found");
    }

    return roles;
  }
}

module.exports = new RoleService();
