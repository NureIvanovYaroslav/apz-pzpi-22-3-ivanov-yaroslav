const { validationResult } = require("express-validator");
const goalService = require("../services/GoalService");
const actionLogService = require("../services/LogService");
const ApiError = require("../errors/apiError");
const GoalDto = require("../dtos/goal-dto");

class GoalController {
  async createGoal(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        actionLogService.log({
          userId: req.user?.id || "unknown",
          description: "Create goal (validation error)",
          success: false,
        });
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const goal = await goalService.createGoal(req.body);
      const goalDto = new GoalDto(goal);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create goal",
        success: true,
      });

      return res.status(200).json(goalDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create goal",
        success: false,
      });
      next(e);
    }
  }

  async getGoalById(req, res, next) {
    try {
      const { id } = req.params;
      const goal = await goalService.getGoalById(id);
      const goalDto = new GoalDto(goal);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get goal by id: ${id}`,
        success: true,
      });

      return res.status(200).json(goalDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get goal by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async updateGoalById(req, res, next) {
    try {
      const { id } = req.params;
      const goal = await goalService.updateGoalById(id, req.body);
      const goalDto = new GoalDto(goal);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update goal by id: ${id}`,
        success: true,
      });

      return res.status(200).json(goalDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update goal by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async deleteGoalById(req, res, next) {
    try {
      const { id } = req.params;
      await goalService.deleteGoalById(id);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete goal by id: ${id}`,
        success: true,
      });

      return res.status(200).json({ message: "Goal successfully deleted" });
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete goal by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async getAllGoals(req, res, next) {
    try {
      const goals = await goalService.getAllGoals();
      const goalsDto = goals.map((goal) => new GoalDto(goal));

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all goals",
        success: true,
      });

      return res.status(200).json(goalsDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all goals",
        success: false,
      });
      next(e);
    }
  }

  async getGoalsByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const goals = await goalService.getGoalsByUserId(userId);
      const goalsDto = goals.map((goal) => new GoalDto(goal));

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get goals by user id: ${userId}`,
        success: true,
      });

      return res.status(200).json(goalsDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get goals by user id: ${req.params.userId}`,
        success: false,
      });
      next(e);
    }
  }
}

module.exports = new GoalController();
