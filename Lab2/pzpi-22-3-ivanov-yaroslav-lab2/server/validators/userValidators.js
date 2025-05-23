const ApiError = require("../errors/apiError");
const UserModel = require("../models/User");

class UserValidators {
  static validateName(name) {
    if (!name || typeof name !== "string" || name.trim() === "") {
      throw ApiError.BadRequest(
        "Name is required and must be a non-empty string"
      );
    }
  }

  static validateBirthDate(birthDate) {
    if (!birthDate || isNaN(Date.parse(birthDate))) {
      throw ApiError.BadRequest(
        "Birth date is required and must be a valid date"
      );
    }
  }

  static validateHeight(height) {
    if (!height || typeof height !== "number" || height <= 0) {
      throw ApiError.BadRequest(
        "Height is required and must be a number greater than zero"
      );
    }
  }

  static validateWeight(weight) {
    if (!weight || typeof weight !== "number" || weight <= 0) {
      throw ApiError.BadRequest(
        "Weight is required and must be a number greater than zero"
      );
    }
  }

  static validateCountry(country) {
    if (!country || typeof country !== "string" || country.trim() === "") {
      throw ApiError.BadRequest(
        "Country is required and must be a non-empty string"
      );
    }
  }

  static validateSex(sex) {
    if (!sex || typeof sex !== "string" || sex.trim() === "") {
      throw ApiError.BadRequest(
        "Sex is required and must be a non-empty string"
      );
    }
  }

  static async validateUserExists(id) {
    const user = await UserModel.findById(id);
    if (!user) {
      throw ApiError.NotFound("User not found");
    }
    return user;
  }

  static validateUsersNotEmpty(users) {
    if (!users || users.length === 0) {
      throw ApiError.NotFound("Users not found");
    }
  }
}

module.exports = UserValidators;
