const { validationResult } = require("express-validator");
const trainingDataService = require("../services/TrainingDataService");
const actionLogService = require("../services/LogService");
const ApiError = require("../errors/apiError");
const TrainingDataDto = require("../dtos/training-data-dto");

class TrainingDataController {
  async createTrainingData(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        actionLogService.log({
          userId: req.user?.id || "unknown",
          description: "Create training data (validation error)",
          success: false,
        });
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const trainingData = await trainingDataService.createTrainingData(
        req.body
      );
      const trainingDataDto = new TrainingDataDto(trainingData);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create training data",
        success: true,
      });

      return res.status(200).json(trainingDataDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create training data",
        success: false,
      });
      next(e);
    }
  }

  async getTrainingDataById(req, res, next) {
    try {
      const { id } = req.params;
      const trainingData = await trainingDataService.getTrainingDataById(id);
      const trainingDataDto = new TrainingDataDto(trainingData);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get training data by id: ${id}`,
        success: true,
      });

      return res.status(200).json(trainingDataDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get training data by id: ${req.params.id}`,
        success: false,
      });
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

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update training data by id: ${id}`,
        success: true,
      });

      return res.status(200).json(trainingDataDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update training data by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async deleteTrainingDataById(req, res, next) {
    try {
      const { id } = req.params;
      await trainingDataService.deleteTrainingDataById(id);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete training data by id: ${id}`,
        success: true,
      });

      return res
        .status(200)
        .json({ message: "Training data successfully deleted" });
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete training data by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async getAllTrainingData(req, res, next) {
    try {
      const trainingData = await trainingDataService.getAllTrainingData();
      const trainingDataDto = trainingData.map(
        (data) => new TrainingDataDto(data)
      );

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all training data",
        success: true,
      });

      return res.status(200).json(trainingDataDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all training data",
        success: false,
      });
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

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get training data by trainingId: ${trainingId}`,
        success: true,
      });

      return res.status(200).json(trainingDataDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get training data by trainingId: ${req.params.trainingId}`,
        success: false,
      });
      next(e);
    }
  }
}

module.exports = new TrainingDataController();
