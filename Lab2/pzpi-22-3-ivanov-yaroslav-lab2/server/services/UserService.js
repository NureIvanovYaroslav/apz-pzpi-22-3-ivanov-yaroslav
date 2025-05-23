const DeviceModel = require("../models/Device");
const GoalModel = require("../models/Goal");
const NotificationModel = require("../models/Notification");
const RoleModel = require("../models/Role");
const UserModel = require("../models/User");
const UserFitnessStudioModel = require("../models/UserFitnessStudio");
const ApiError = require("../errors/apiError");
const UserValidators = require("../validators/userValidators");

class UserService {
  /**
   * Retrieves a user by their ID.
   * @param {string} id - The user ID.
   * @returns {Promise<Object>} - The user data.
   */
  async getUserById(id) {
    const user = await UserValidators.validateUserExists(id);

    return user;
  }

  /**
   * Edits personal data of a user.
   * @param {string} id - The user ID.
   * @param {Object} updatedFields - The fields to update.
   * @returns {Promise<Object>} - The updated user data.
   */
  async editPersonalData(id, updatedFields) {
    this._validateUserData(updatedFields);

    const user = await UserValidators.validateUserExists(id);

    Object.assign(user, updatedFields);

    await user.save();

    return user;
  }

  /**
   * Deletes a user by their ID.
   * @param {string} id - The user ID.
   * @returns {Promise<Object>} - The deleted user data.
   */
  async deleteUserById(id) {
    const user = await UserValidators.validateUserExists(id);

    await GoalModel.deleteMany({ user: user._id });

    await NotificationModel.deleteMany({ user: user._id });

    if (user.device) {
      await DeviceModel.findByIdAndDelete(user.device);
    }

    await UserFitnessStudioModel.deleteMany({ user: user._id });

    await UserModel.findByIdAndDelete(id);

    return user;
  }

  /**
   * Retrieves all users.
   * @returns {Promise<Array>} - The list of users.
   */
  async getAllUsers() {
    const users = await UserModel.find();

    UserValidators.validateUsersNotEmpty(users);

    return users;
  }

  /**
   * Adds a role to a user.
   * @param {string} userId - The user ID.
   * @param {string} role - The role to add.
   * @returns {Promise<Object>} - The updated user data.
   */
  async addUserRole(userId, role) {
    const user = await UserValidators.validateUserExists(userId);

    const userRole = await RoleModel.findOne({ value: role });

    if (!userRole) {
      throw ApiError.NotFound("Role not found");
    }

    const userHasRole = user.roles.includes(role);

    if (!userHasRole) {
      user.roles.push(userRole.value);
    } else {
      throw ApiError.BadRequest("User already has this role");
    }

    user.markModified("roles");

    await user.save();

    return user;
  }

  /**
   * Deletes a role from a user.
   * @param {string} userId - The user ID.
   * @param {string} role - The role to delete.
   * @returns {Promise<Object>} - The updated user data.
   */
  async deleteUserRole(userId, role) {
    const user = await UserValidators.validateUserExists(userId);

    const userRole = await RoleModel.findOne({ value: role });

    if (!userRole) {
      throw ApiError.NotFound("Role not found");
    }

    const userHasRole = user.roles.includes(role);

    if (!userHasRole) {
      throw ApiError.BadRequest("User does not have this role");
    }

    user.roles = user.roles.filter((roles) => roles !== role);

    await user.save();

    return user;
  }

  /**
   * Validates the user data.
   * @param {Object} data - The user data.
   */
  _validateUserData(data) {
    if (data.name) {
      UserValidators.validateName(data.name);
    }
    if (data.birthDate) {
      UserValidators.validateBirthDate(data.birthDate);
    }
    if (data.height) {
      UserValidators.validateHeight(data.height);
    }
    if (data.weight) {
      UserValidators.validateWeight(data.weight);
    }
    if (data.country) {
      UserValidators.validateCountry(data.country);
    }
    if (data.gender) {
      UserValidators.validateGender(data.gender);
    }
  }
}

module.exports = new UserService();
