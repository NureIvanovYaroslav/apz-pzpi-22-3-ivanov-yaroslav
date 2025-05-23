const GoalModel = require("../models/Goal");
const UserModel = require("../models/User");
const GoalValidators = require("../validators/goalValidators");

class GoalService {
  /**
   * Creates a new goal.
   * @param {Object} data - The goal data.
   * @returns {Promise<Object>} - The created goal.
   */
  async createGoal(data) {
    this._validateGoalData(data);

    const user = await GoalValidators.validateUserExists(data.user);

    const goal = await GoalModel.create(data);

    user.goals.push(goal._id);
    await user.save();

    return goal;
  }

  /**
   * Retrieves a goal by its ID.
   * @param {string} id - The goal ID.
   * @returns {Promise<Object>} - The goal data.
   */
  async getGoalById(id) {
    const goal = await GoalValidators.validateGoalExists(id);

    return goal;
  }

  /**
   * Updates a goal by its ID.
   * @param {string} id - The goal ID.
   * @param {Object} updatedFields - The fields to update.
   * @returns {Promise<Object>} - The updated goal.
   */
  async updateGoalById(id, updatedFields) {
    this._validateGoalData(updatedFields);

    await GoalValidators.validateGoalExists(id);

    const goal = await GoalModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    return goal;
  }

  /**
   * Deletes a goal by its ID.
   * @param {string} id - The goal ID.
   * @returns {Promise<Object>} - The deleted goal.
   */
  async deleteGoalById(id) {
    const goal = await GoalValidators.validateGoalExists(id);

    const user = await GoalValidators.validateUserExists(goal.user);
    user.goals.pull(goal._id);
    await user.save();

    await GoalModel.findByIdAndDelete(id);

    return goal;
  }

  /**
   * Retrieves all goals.
   * @returns {Promise<Array>} - The list of goals.
   */
  async getAllGoals() {
    const goals = await GoalModel.find();

    GoalValidators.validateGoalsNotEmpty(goals);

    return goals;
  }

  /**
   * Retrieves goals by user ID.
   * @param {string} userId - The user ID.
   * @returns {Promise<Array>} - The list of goals for the user.
   */
  async getGoalsByUserId(userId) {
    await GoalValidators.validateUserExists(userId);

    const user = await UserModel.findById(userId).populate("goals");

    const goals = user.goals;

    GoalValidators.validateGoalsNotEmpty(goals);

    return goals;
  }

  /**
   * Validates the goal data.
   * @param {Object} data - The goal data.
   */
  _validateGoalData(data) {
    if (data.status) {
      GoalValidators.validateStatus(data.status);
    }
    if (data.content) {
      GoalValidators.validateContent(data.content);
    }
    if (data.startDate && data.finishDate) {
      GoalValidators.validateDates(data.startDate, data.finishDate);
    }
  }
}

module.exports = new GoalService();
