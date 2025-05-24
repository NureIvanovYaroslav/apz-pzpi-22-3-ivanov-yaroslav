const { validationResult } = require("express-validator");
const trainingService = require("../services/TrainingService");
const actionLogService = require("../services/LogService");
const ApiError = require("../errors/apiError");
const TrainingDto = require("../dtos/training-dto");

class TrainingController {
  async createTraining(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        actionLogService.log({
          userId: req.user?.id || "unknown",
          description: "Create training (validation error)",
          success: false,
        });
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const training = await trainingService.createTraining(req.body);
      const trainingDto = new TrainingDto(training);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create training",
        success: true,
      });

      return res.status(200).json(trainingDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create training",
        success: false,
      });
      next(e);
    }
  }

  async getTrainingById(req, res, next) {
    try {
      const { id } = req.params;
      const training = await trainingService.getTrainingById(id);
      const trainingDto = new TrainingDto(training);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get training by id: ${id}`,
        success: true,
      });

      return res.status(200).json(trainingDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get training by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async updateTrainingById(req, res, next) {
    try {
      const { id } = req.params;
      const training = await trainingService.updateTrainingById(id, req.body);
      const trainingDto = new TrainingDto(training);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update training by id: ${id}`,
        success: true,
      });

      return res.status(200).json(trainingDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update training by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async deleteTrainingById(req, res, next) {
    try {
      const { id } = req.params;
      await trainingService.deleteTrainingById(id);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete training by id: ${id}`,
        success: true,
      });

      return res.status(200).json({ message: "Training successfully deleted" });
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete training by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async getAllTrainings(req, res, next) {
    try {
      const trainings = await trainingService.getAllTrainings();
      const trainingsDto = trainings.map(
        (training) => new TrainingDto(training)
      );

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all trainings",
        success: true,
      });

      return res.status(200).json(trainingsDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all trainings",
        success: false,
      });
      next(e);
    }
  }

  async getTrainingsByUserFitnessStudioId(req, res, next) {
    try {
      const { userFitnessStudioId } = req.params;
      const trainings = await trainingService.getTrainingsByUserFitnessStudioId(
        userFitnessStudioId
      );
      const trainingsDto = trainings.map(
        (training) => new TrainingDto(training)
      );

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get trainings by userFitnessStudioId: ${userFitnessStudioId}`,
        success: true,
      });

      return res.status(200).json(trainingsDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get trainings by userFitnessStudioId: ${req.params.userFitnessStudioId}`,
        success: false,
      });
      next(e);
    }
  }

  async getTrainingsByDeviceId(req, res, next) {
    try {
      const { deviceId } = req.params;
      const trainings = await trainingService.getTrainingsByDeviceId(deviceId);
      const trainingsDto = trainings.map(
        (training) => new TrainingDto(training)
      );

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get trainings by deviceId: ${deviceId}`,
        success: true,
      });

      return res.status(200).json(trainingsDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get trainings by deviceId: ${req.params.deviceId}`,
        success: false,
      });
      next(e);
    }
  }
}

module.exports = new TrainingController();
