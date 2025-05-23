const ApiError = require("../errors/apiError");
const TrainingModel = require("../models/Training");
const DeviceModel = require("../models/Device");
const UserFitnessStudioModel = require("../models/UserFitnessStudio");

class TrainingValidators {
  static validateType(type) {
    if (!type || typeof type !== "string" || type.trim() === "") {
      throw ApiError.BadRequest(
        "Type is required and must be a non-empty string"
      );
    }
  }

  static validateDates(startTime, endTime) {
    if (!startTime || isNaN(Date.parse(startTime))) {
      throw ApiError.BadRequest(
        "Start time is required and must be a valid date"
      );
    }
    if (!endTime || isNaN(Date.parse(endTime))) {
      throw ApiError.BadRequest(
        "End time is required and must be a valid date"
      );
    }
  }

  static async validateTrainingExists(id) {
    const training = await TrainingModel.findById(id);
    if (!training) {
      throw ApiError.NotFound("Training not found");
    }
    return training;
  }

  static async validateDeviceExists(deviceId) {
    const device = await DeviceModel.findById(deviceId);
    if (!device) {
      throw ApiError.NotFound("Device not found");
    }
    return device;
  }

  static async validateUserFitnessStudioExists(userFitnessStudioId) {
    const userFitnessStudio = await UserFitnessStudioModel.findById(
      userFitnessStudioId
    );
    if (!userFitnessStudio) {
      throw ApiError.NotFound("UserFitnessStudio not found");
    }
    return userFitnessStudio;
  }

  static validateTrainingsNotEmpty(trainings) {
    if (!trainings || trainings.length === 0) {
      throw ApiError.NotFound("Trainings not found");
    }
  }
}

module.exports = TrainingValidators;
