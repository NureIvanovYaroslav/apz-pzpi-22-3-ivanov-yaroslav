const { validationResult } = require("express-validator");
const userFitnessStudioService = require("../services/UserFitnessStudioService");
const ApiError = require("../errors/apiError");
const UserFitnessStudioDto = require("../dtos/user-fitness-studio-dto");

class UserFitnessStudioController {
  async createUserFitnessStudio(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { userId, fitnessStudioId } = req.body;
      const userFitnessStudio =
        await userFitnessStudioService.createUserFitnessStudio(
          userId,
          fitnessStudioId
        );
      const userFitnessStudioDto = new UserFitnessStudioDto(userFitnessStudio);

      return res.status(200).json(userFitnessStudioDto);
    } catch (e) {
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

      return res.status(200).json({
        message: "User successfully removed from fitness studio",
      });
    } catch (e) {
      next(e);
    }
  }

  async getUsersByFitnessStudioId(req, res, next) {
    try {
      const { fitnessStudioId } = req.params;
      const users = await userFitnessStudioService.getUsersByFitnessStudioId(
        fitnessStudioId
      );

      return res.status(200).json(users);
    } catch (e) {
      next(e);
    }
  }

  async getFitnessStudiosByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const fitnessStudios =
        await userFitnessStudioService.getFitnessStudiosByUserId(userId);

      return res.status(200).json(fitnessStudios);
    } catch (e) {
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

      return res.status(200).json(userFitnessStudiosDto);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserFitnessStudioController();
