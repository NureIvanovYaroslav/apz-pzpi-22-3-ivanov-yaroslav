const { validationResult } = require("express-validator");
const fitnessStudioService = require("../services/FitnessStudioService");
const actionLogService = require("../services/LogService");
const ApiError = require("../errors/apiError");
const FitnessStudioDto = require("../dtos/fitness-studio-dto");

class FitnessStudioController {
  async createFitnessStudio(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        actionLogService.log({
          userId: req.user?.id || "unknown",
          description: "Create fitness studio (validation error)",
          success: false,
        });
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const fitnessStudio = await fitnessStudioService.createFitnessStudio(
        req.body
      );
      const fitnessStudioDto = new FitnessStudioDto(fitnessStudio);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create fitness studio",
        success: true,
      });

      return res.status(200).json(fitnessStudioDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create fitness studio",
        success: false,
      });
      next(e);
    }
  }

  async getFitnessStudioById(req, res, next) {
    try {
      const { id } = req.params;
      const fitnessStudio = await fitnessStudioService.getFitnessStudioById(id);
      const fitnessStudioDto = new FitnessStudioDto(fitnessStudio);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get fitness studio by id: ${id}`,
        success: true,
      });

      return res.status(200).json(fitnessStudioDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get fitness studio by id: ${req.params.id}`,
        success: false,
      });
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

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update fitness studio by id: ${id}`,
        success: true,
      });

      return res.status(200).json(fitnessStudioDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update fitness studio by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async deleteFitnessStudioById(req, res, next) {
    try {
      const { id } = req.params;
      await fitnessStudioService.deleteFitnessStudioById(id);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete fitness studio by id: ${id}`,
        success: true,
      });

      return res
        .status(200)
        .json({ message: "Fitness studio successfully deleted" });
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete fitness studio by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async getAllFitnessStudios(req, res, next) {
    try {
      const fitnessStudios = await fitnessStudioService.getAllFitnessStudios();
      const fitnessStudiosDto = fitnessStudios.map(
        (studio) => new FitnessStudioDto(studio)
      );

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all fitness studios",
        success: true,
      });

      return res.status(200).json(fitnessStudiosDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all fitness studios",
        success: false,
      });
      next(e);
    }
  }
}

module.exports = new FitnessStudioController();
