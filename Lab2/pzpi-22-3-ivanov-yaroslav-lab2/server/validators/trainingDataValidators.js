const ApiError = require("../errors/apiError");
const TrainingDataModel = require("../models/TrainingData");
const TrainingModel = require("../models/Training");

class TrainingDataValidators {
  static validateSendingTime(sendingTime) {
    if (!sendingTime || isNaN(Date.parse(sendingTime))) {
      throw ApiError.BadRequest(
        "Sending time is required and must be a valid date"
      );
    }
  }

  static validateHeartRate(heartRate) {
    if (!heartRate || typeof heartRate !== "number" || heartRate <= 0) {
      throw ApiError.BadRequest(
        "Heart rate is required and must be a number greater than zero"
      );
    }
  }

  static validateSteps(steps) {
    if (!steps || typeof steps !== "number" || steps <= 0) {
      throw ApiError.BadRequest(
        "Steps is required and must be a number greater than zero"
      );
    }
  }

  static async validateTrainingDataExists(id) {
    const trainingData = await TrainingDataModel.findById(id);
    if (!trainingData) {
      throw ApiError.NotFound("Training data not found");
    }
    return trainingData;
  }

  static async validateTrainingExists(trainingId) {
    const training = await TrainingModel.findById(trainingId);
    if (!training) {
      throw ApiError.NotFound("Training not found");
    }
    return training;
  }

  static validateTrainingDataNotEmpty(trainingDatas) {
    if (!trainingDatas || trainingDatas.length === 0) {
      throw ApiError.NotFound("Training datas not found");
    }
  }
}

module.exports = TrainingDataValidators;
