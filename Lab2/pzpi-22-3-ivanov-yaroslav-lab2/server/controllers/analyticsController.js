const analyticsService = require("../services/AnalyticsService");

class AnalyticsController {
  async getStepRecommendations(req, res, next) {
    try {
      const trainingId = req.params.id;
      const recommendations = await analyticsService.getStepRecommendations(
        trainingId
      );
      res.status(200).json(recommendations);
    } catch (e) {
      next(e);
    }
  }

  async getCaloriesRecommendations(req, res, next) {
    try {
      const trainingId = req.params.id;
      const recommendations = await analyticsService.getCaloriesRecommendations(
        trainingId
      );
      res.status(200).json(recommendations);
    } catch (e) {
      next(e);
    }
  }

  async getHeartRateRecommendations(req, res, next) {
    try {
      const trainingId = req.params.id;
      const recommendations =
        await analyticsService.getHeartRateRecommendations(trainingId);
      res.status(200).json(recommendations);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AnalyticsController();
