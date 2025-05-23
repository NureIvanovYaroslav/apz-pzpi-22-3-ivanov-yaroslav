const UserFitnessStudioModel = require("../models/UserFitnessStudio");
const TrainingModel = require("../models/Training");

const UserFitnessStudioValidators = require("../validators/userFitnessStudioValidators");

class UserFitnessStudioService {
  /**
   * Creates a new user-fitness studio association.
   * @param {string} userId - The user ID.
   * @param {string} fitnessStudioId - The fitness studio ID.
   * @returns {Promise<Object>} - The created user-fitness studio association.
   */
  async createUserFitnessStudio(userId, fitnessStudioId) {
    const user = await UserFitnessStudioValidators.validateUserExists(userId);
    const fitnessStudio =
      await UserFitnessStudioValidators.validateFitnessStudioExists(
        fitnessStudioId
      );

    await UserFitnessStudioValidators.validateUserFitnessStudioExists(
      userId,
      fitnessStudioId
    );

    const userFitnessStudio = await UserFitnessStudioModel.create({
      user: userId,
      fitnessStudio: fitnessStudioId,
    });

    user.userFitnessStudios.push(userFitnessStudio._id);
    await user.save();

    fitnessStudio.userFitnessStudios.push(userFitnessStudio._id);
    await fitnessStudio.save();

    return userFitnessStudio;
  }

  /**
   * Deletes a user-fitness studio association.
   * @param {string} userId - The user ID.
   * @param {string} fitnessStudioId - The fitness studio ID.
   * @returns {Promise<Object>} - The deleted user-fitness studio association.
   */
  async deleteUserFitnessStudio(userId, fitnessStudioId) {
    const userFitnessStudio =
      await UserFitnessStudioValidators.validateUserFitnessStudioNotExists(
        userId,
        fitnessStudioId
      );

    const user = await UserFitnessStudioValidators.validateUserExists(userId);
    user.userFitnessStudios.pull(userFitnessStudio._id);
    await user.save();

    const fitnessStudio =
      await UserFitnessStudioValidators.validateFitnessStudioExists(
        fitnessStudioId
      );
    fitnessStudio.userFitnessStudios.pull(userFitnessStudio._id);
    await fitnessStudio.save();

    await TrainingModel.deleteMany({
      userFitnessStudio: userFitnessStudio._id,
    });

    await UserFitnessStudioModel.findByIdAndDelete(userFitnessStudio._id);

    return userFitnessStudio;
  }

  /**
   * Retrieves users by fitness studio ID.
   * @param {string} fitnessStudioId - The fitness studio ID.
   * @returns {Promise<Array>} - The list of users for the fitness studio.
   */
  async getUsersByFitnessStudioId(fitnessStudioId) {
    await UserFitnessStudioValidators.validateFitnessStudioExists(
      fitnessStudioId
    );

    const userFitnessStudios = await UserFitnessStudioModel.find({
      fitnessStudio: fitnessStudioId,
    }).populate("user");

    UserFitnessStudioValidators.validateUserFitnessStudiosNotEmpty(
      userFitnessStudios
    );

    return userFitnessStudios.map((ufs) => ufs.user);
  }

  /**
   * Retrieves fitness studios by user ID.
   * @param {string} userId - The user ID.
   * @returns {Promise<Array>} - The list of fitness studios for the user.
   */
  async getFitnessStudiosByUserId(userId) {
    await UserFitnessStudioValidators.validateUserExists(userId);

    const userFitnessStudios = await UserFitnessStudioModel.find({
      user: userId,
    }).populate("fitnessStudio");

    UserFitnessStudioValidators.validateUserFitnessStudiosNotEmpty(
      userFitnessStudios
    );

    return userFitnessStudios.map((ufs) => ufs.fitnessStudio);
  }

  /**
   * Retrieves all user-fitness studio associations.
   * @returns {Promise<Array>} - The list of user-fitness studio associations.
   */
  async getAllUserFitnessStudios() {
    const userFitnessStudios = await UserFitnessStudioModel.find();

    UserFitnessStudioValidators.validateUserFitnessStudiosNotEmpty(
      userFitnessStudios
    );

    return userFitnessStudios;
  }
}

module.exports = new UserFitnessStudioService();
