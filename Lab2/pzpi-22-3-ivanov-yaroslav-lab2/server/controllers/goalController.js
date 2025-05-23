const { validationResult } = require("express-validator");
const goalService = require("../services/GoalService");
const ApiError = require("../errors/apiError");
const GoalDto = require("../dtos/goal-dto");

class GoalController {
  async createGoal(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const goal = await goalService.createGoal(req.body);
      const goalDto = new GoalDto(goal);

      return res.status(200).json(goalDto);
    } catch (e) {
      next(e);
    }
  }

  async getGoalById(req, res, next) {
    try {
      const { id } = req.params;
      const goal = await goalService.getGoalById(id);
      const goalDto = new GoalDto(goal);

      return res.status(200).json(goalDto);
    } catch (e) {
      next(e);
    }
  }

  async updateGoalById(req, res, next) {
    try {
      const { id } = req.params;
      const goal = await goalService.updateGoalById(id, req.body);
      const goalDto = new GoalDto(goal);

      return res.status(200).json(goalDto);
    } catch (e) {
      next(e);
    }
  }

  async deleteGoalById(req, res, next) {
    try {
      const { id } = req.params;
      await goalService.deleteGoalById(id);

      return res.status(200).json({ message: "Goal successfully deleted" });
    } catch (e) {
      next(e);
    }
  }

  async getAllGoals(req, res, next) {
    try {
      const goals = await goalService.getAllGoals();
      const goalsDto = goals.map((goal) => new GoalDto(goal));

      return res.status(200).json(goalsDto);
    } catch (e) {
      next(e);
    }
  }

  async getGoalsByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const goals = await goalService.getGoalsByUserId(userId);
      const goalsDto = goals.map((goal) => new GoalDto(goal));

      return res.status(200).json(goalsDto);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new GoalController();
