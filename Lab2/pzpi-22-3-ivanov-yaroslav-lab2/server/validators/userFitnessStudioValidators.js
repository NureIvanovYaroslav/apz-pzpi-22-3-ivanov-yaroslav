const ApiError = require("../errors/apiError");
const UserFitnessStudioModel = require("../models/UserFitnessStudio");
const UserModel = require("../models/User");
const FitnessStudioModel = require("../models/FitnessStudio");

class UserFitnessStudioValidators {
  static async validateUserExists(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.NotFound("User not found");
    }
    return user;
  }

  static async validateFitnessStudioExists(fitnessStudioId) {
    const fitnessStudio = await FitnessStudioModel.findById(fitnessStudioId);
    if (!fitnessStudio) {
      throw ApiError.NotFound("Fitness studio not found");
    }
    return fitnessStudio;
  }

  static async validateUserFitnessStudioExists(userId, fitnessStudioId) {
    const userFitnessStudio = await UserFitnessStudioModel.findOne({
      user: userId,
      fitnessStudio: fitnessStudioId,
    });
    if (userFitnessStudio) {
      throw ApiError.BadRequest(
        "User is already associated with this fitness studio"
      );
    }
  }

  static async validateUserFitnessStudioNotExists(userId, fitnessStudioId) {
    const userFitnessStudio = await UserFitnessStudioModel.findOne({
      user: userId,
      fitnessStudio: fitnessStudioId,
    });
    if (!userFitnessStudio) {
      throw ApiError.NotFound(
        "User is not associated with this fitness studio"
      );
    }
    return userFitnessStudio;
  }

  static validateUserFitnessStudiosNotEmpty(userFitnessStudios) {
    if (userFitnessStudios.length === 0) {
      throw ApiError.NotFound("User-fitness studio combinations not found");
    }
  }
}

module.exports = UserFitnessStudioValidators;
