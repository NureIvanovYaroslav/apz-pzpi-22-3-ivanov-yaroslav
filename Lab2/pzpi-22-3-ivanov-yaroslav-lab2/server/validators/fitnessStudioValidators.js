const ApiError = require("../errors/apiError");
const FitnessStudioModel = require("../models/FitnessStudio");

class FitnessStudioValidators {
  static validateStudioName(studioName) {
    if (
      !studioName ||
      typeof studioName !== "string" ||
      studioName.trim() === ""
    ) {
      throw ApiError.BadRequest(
        "Studio name is required and must be a non-empty string"
      );
    }
  }

  static validateAddress(address) {
    if (!address || typeof address !== "string" || address.trim() === "") {
      throw ApiError.BadRequest(
        "Address is required and must be a non-empty string"
      );
    }
  }

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      throw ApiError.BadRequest(
        "Email is required and must be in valid format"
      );
    }
  }

  static async validateFitnessStudioExists(id) {
    const fitnessStudio = await FitnessStudioModel.findById(id);
    if (!fitnessStudio) {
      throw ApiError.NotFound("Fitness studio not found");
    }
    return fitnessStudio;
  }

  static validateFitnessStudiosNotEmpty(fitnessStudios) {
    if (fitnessStudios.length === 0) {
      throw ApiError.NotFound("Fitness studios not found");
    }
  }
}

module.exports = FitnessStudioValidators;
