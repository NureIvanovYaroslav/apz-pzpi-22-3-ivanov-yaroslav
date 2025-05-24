const { validationResult } = require("express-validator");
const userFitnessStudioService = require("../services/UserFitnessStudioService");
const actionLogService = require("../services/LogService");
const ApiError = require("../errors/apiError");
const UserFitnessStudioDto = require("../dtos/user-fitness-studio-dto");

class UserFitnessStudioController {
  async createUserFitnessStudio(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        actionLogService.log({
          userId: req.user?.id || "unknown",
          description: "Create user-fitness-studio (validation error)",
          success: false,
        });
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { userId, fitnessStudioId } = req.body;
      const userFitnessStudio =
        await userFitnessStudioService.createUserFitnessStudio(
          userId,
          fitnessStudioId
        );
      const userFitnessStudioDto = new UserFitnessStudioDto(userFitnessStudio);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Create user-fitness-studio: userId=${userId}, fitnessStudioId=${fitnessStudioId}`,
        success: true,
      });

      return res.status(200).json(userFitnessStudioDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create user-fitness-studio",
        success: false,
      });
      next(e);
    }
  }

  async deleteUserFitnessStudio(req, res, next) {
    try {
      const { userId, fitnessStudioId } = req.body;
      await userFitnessStudioService.deleteUserFitnessStudio(
        userId,
        fitnessStudioId
      );

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete user-fitness-studio: userId=${userId}, fitnessStudioId=${fitnessStudioId}`,
        success: true,
      });

      return res.status(200).json({
        message: "User successfully removed from fitness studio",
      });
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Delete user-fitness-studio",
        success: false,
      });
      next(e);
    }
  }

  async getUsersByFitnessStudioId(req, res, next) {
    try {
      const { fitnessStudioId } = req.params;
      const users = await userFitnessStudioService.getUsersByFitnessStudioId(
        fitnessStudioId
      );

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get users by fitnessStudioId: ${fitnessStudioId}`,
        success: true,
      });

      return res.status(200).json(users);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get users by fitnessStudioId: ${req.params.fitnessStudioId}`,
        success: false,
      });
      next(e);
    }
  }

  async getFitnessStudiosByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const fitnessStudios =
        await userFitnessStudioService.getFitnessStudiosByUserId(userId);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get fitness studios by userId: ${userId}`,
        success: true,
      });

      return res.status(200).json(fitnessStudios);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get fitness studios by userId: ${req.params.userId}`,
        success: false,
      });
      next(e);
    }
  }

  async getAllUserFitnessStudios(req, res, next) {
    try {
      const userFitnessStudios =
        await userFitnessStudioService.getAllUserFitnessStudios();
      const userFitnessStudiosDto = userFitnessStudios.map(
        (ufs) => new UserFitnessStudioDto(ufs)
      );

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all user-fitness-studios",
        success: true,
      });

      return res.status(200).json(userFitnessStudiosDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all user-fitness-studios",
        success: false,
      });
      next(e);
    }
  }
}

module.exports = new UserFitnessStudioController();
