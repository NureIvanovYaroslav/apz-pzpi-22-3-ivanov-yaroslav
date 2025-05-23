const { validationResult } = require("express-validator");
const trainingDataService = require("../services/TrainingDataService");
const ApiError = require("../errors/apiError");
const TrainingDataDto = require("../dtos/training-data-dto");

class TrainingDataController {
  async createTrainingData(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const trainingData = await trainingDataService.createTrainingData(
        req.body
      );
      const trainingDataDto = new TrainingDataDto(trainingData);

      return res.status(200).json(trainingDataDto);
    } catch (e) {
      next(e);
    }
  }

  async getTrainingDataById(req, res, next) {
    try {
      const { id } = req.params;
      const trainingData = await trainingDataService.getTrainingDataById(id);
      const trainingDataDto = new TrainingDataDto(trainingData);

      return res.status(200).json(trainingDataDto);
    } catch (e) {
      next(e);
    }
  }

  async updateTrainingDataById(req, res, next) {
    try {
      const { id } = req.params;
      const trainingData = await trainingDataService.updateTrainingDataById(
        id,
        req.body
      );
      const trainingDataDto = new TrainingDataDto(trainingData);

      return res.status(200).json(trainingDataDto);
    } catch (e) {
      next(e);
    }
  }

  async deleteTrainingDataById(req, res, next) {
    try {
      const { id } = req.params;
      await trainingDataService.deleteTrainingDataById(id);

      return res
        .status(200)
        .json({ message: "Training data successfully deleted" });
    } catch (e) {
      next(e);
    }
  }

  async getAllTrainingData(req, res, next) {
    try {
      const trainingData = await trainingDataService.getAllTrainingData();
      const trainingDataDto = trainingData.map(
        (data) => new TrainingDataDto(data)
      );

      return res.status(200).json(trainingDataDto);
    } catch (e) {
      next(e);
    }
  }

  async getTrainingDataByTrainingId(req, res, next) {
    try {
      const { trainingId } = req.params;
      const trainingData =
        await trainingDataService.getTrainingDataByTrainingId(trainingId);
      const trainingDataDto = trainingData.map(
        (data) => new TrainingDataDto(data)
      );

      return res.status(200).json(trainingDataDto);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new TrainingDataController();
