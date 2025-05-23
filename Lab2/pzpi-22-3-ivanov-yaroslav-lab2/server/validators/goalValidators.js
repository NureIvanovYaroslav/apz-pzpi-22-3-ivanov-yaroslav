const ApiError = require("../errors/apiError");
const GoalModel = require("../models/Goal");
const UserModel = require("../models/User");

class GoalValidators {
  static validateStatus(status) {
    if (!status || typeof status !== "string" || status.trim() === "") {
      throw ApiError.BadRequest(
        "Status is required and must be a non-empty string"
      );
    }
  }

  static validateContent(content) {
    if (!content || typeof content !== "string" || content.trim() === "") {
      throw ApiError.BadRequest(
        "Content is required and must be a non-empty string"
      );
    }
  }

  static validateDates(startDate, finishDate) {
    if (!startDate || isNaN(Date.parse(startDate))) {
      throw ApiError.BadRequest(
        "Start date is required and must be a valid date"
      );
    }
    if (!finishDate || isNaN(Date.parse(finishDate))) {
      throw ApiError.BadRequest(
        "Finish date is required and must be a valid date"
      );
    }
  }

  static async validateGoalExists(id) {
    const goal = await GoalModel.findById(id);
    if (!goal) {
      throw ApiError.NotFound("Goal not found");
    }
    return goal;
  }

  static async validateUserExists(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.NotFound("User not found");
    }
    return user;
  }

  static validateGoalsNotEmpty(goals) {
    if (!goals || goals.length === 0) {
      throw ApiError.NotFound("Goals not found");
    }
  }
}

module.exports = GoalValidators;
