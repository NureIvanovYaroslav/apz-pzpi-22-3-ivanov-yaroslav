const analyticsService = require("../services/AnalyticsService");
const actionLogService = require("../services/LogService");

class AnalyticsController {
  async getStepRecommendations(req, res, next) {
    try {
      const trainingId = req.params.id;
      const recommendations = await analyticsService.getStepRecommendations(
        trainingId
      );
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get step recommendations for training ${trainingId}`,
        success: true,
      });
      res.status(200).json(recommendations);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get step recommendations for training ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async getCaloriesRecommendations(req, res, next) {
    try {
      const trainingId = req.params.id;
      const recommendations = await analyticsService.getCaloriesRecommendations(
        trainingId
      );
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get calories recommendations for training ${trainingId}`,
        success: true,
      });
      res.status(200).json(recommendations);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get calories recommendations for training ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async getHeartRateRecommendations(req, res, next) {
    try {
      const trainingId = req.params.id;
      const recommendations =
        await analyticsService.getHeartRateRecommendations(trainingId);
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get heart rate recommendations for training ${trainingId}`,
        success: true,
      });
      res.status(200).json(recommendations);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get heart rate recommendations for training ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }
}

module.exports = new AnalyticsController();
