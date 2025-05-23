const { validationResult } = require("express-validator");
const fitnessStudioService = require("../services/FitnessStudioService");
const ApiError = require("../errors/apiError");
const FitnessStudioDto = require("../dtos/fitness-studio-dto");

class FitnessStudioController {
  async createFitnessStudio(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const fitnessStudio = await fitnessStudioService.createFitnessStudio(
        req.body
      );
      const fitnessStudioDto = new FitnessStudioDto(fitnessStudio);

      return res.status(200).json(fitnessStudioDto);
    } catch (e) {
      next(e);
    }
  }

  async getFitnessStudioById(req, res, next) {
    try {
      const { id } = req.params;
      const fitnessStudio = await fitnessStudioService.getFitnessStudioById(id);
      const fitnessStudioDto = new FitnessStudioDto(fitnessStudio);

      return res.status(200).json(fitnessStudioDto);
    } catch (e) {
      next(e);
    }
  }

  async updateFitnessStudioById(req, res, next) {
    try {
      const { id } = req.params;
      const fitnessStudio = await fitnessStudioService.updateFitnessStudioById(
        id,
        req.body
      );
      const fitnessStudioDto = new FitnessStudioDto(fitnessStudio);

      return res.status(200).json(fitnessStudioDto);
    } catch (e) {
      next(e);
    }
  }

  async deleteFitnessStudioById(req, res, next) {
    try {
      const { id } = req.params;
      await fitnessStudioService.deleteFitnessStudioById(id);

      return res
        .status(200)
        .json({ message: "Fitness studio successfully deleted" });
    } catch (e) {
      next(e);
    }
  }

  async getAllFitnessStudios(req, res, next) {
    try {
      const fitnessStudios = await fitnessStudioService.getAllFitnessStudios();
      const fitnessStudiosDto = fitnessStudios.map(
        (studio) => new FitnessStudioDto(studio)
      );

      return res.status(200).json(fitnessStudiosDto);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new FitnessStudioController();
