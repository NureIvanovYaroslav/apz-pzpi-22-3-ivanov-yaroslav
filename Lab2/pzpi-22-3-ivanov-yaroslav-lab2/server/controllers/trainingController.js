const { validationResult } = require("express-validator");
const trainingService = require("../services/TrainingService");
const ApiError = require("../errors/apiError");
const TrainingDto = require("../dtos/training-dto");

class TrainingController {
  async createTraining(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const training = await trainingService.createTraining(req.body);
      const trainingDto = new TrainingDto(training);

      return res.status(200).json(trainingDto);
    } catch (e) {
      next(e);
    }
  }

  async getTrainingById(req, res, next) {
    try {
      const { id } = req.params;
      const training = await trainingService.getTrainingById(id);
      const trainingDto = new TrainingDto(training);

      return res.status(200).json(trainingDto);
    } catch (e) {
      next(e);
    }
  }

  async updateTrainingById(req, res, next) {
    try {
      const { id } = req.params;
      const training = await trainingService.updateTrainingById(id, req.body);
      const trainingDto = new TrainingDto(training);

      return res.status(200).json(trainingDto);
    } catch (e) {
      next(e);
    }
  }

  async deleteTrainingById(req, res, next) {
    try {
      const { id } = req.params;
      await trainingService.deleteTrainingById(id);

      return res.status(200).json({ message: "Training successfully deleted" });
    } catch (e) {
      next(e);
    }
  }

  async getAllTrainings(req, res, next) {
    try {
      const trainings = await trainingService.getAllTrainings();
      const trainingsDto = trainings.map(
        (training) => new TrainingDto(training)
      );

      return res.status(200).json(trainingsDto);
    } catch (e) {
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

      return res.status(200).json(trainingsDto);
    } catch (e) {
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

      return res.status(200).json(trainingsDto);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new TrainingController();
