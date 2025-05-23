const FitnessStudioModel = require("../models/FitnessStudio");
const UserFitnessStudioModel = require("../models/UserFitnessStudio");
const FitnessStudioValidators = require("../validators/fitnessStudioValidators");

class FitnessStudioService {
  /**
   * Creates a new fitness studio.
   * @param {Object} data - The fitness studio data.
   * @returns {Promise<Object>} - The created fitness studio.
   */
  async createFitnessStudio(data) {
    this._validateFitnessStudioData(data);

    const fitnessStudio = await FitnessStudioModel.create(data);

    return fitnessStudio;
  }

  /**
   * Retrieves a fitness studio by its ID.
   * @param {string} id - The fitness studio ID.
   * @returns {Promise<Object>} - The fitness studio data.
   */
  async getFitnessStudioById(id) {
    const fitnessStudio =
      await FitnessStudioValidators.validateFitnessStudioExists(id);

    return fitnessStudio;
  }

  /**
   * Updates a fitness studio by its ID.
   * @param {string} id - The fitness studio ID.
   * @param {Object} updatedFields - The fields to update.
   * @returns {Promise<Object>} - The updated fitness studio.
   */
  async updateFitnessStudioById(id, updatedFields) {
    this._validateFitnessStudioData(updatedFields);

    await FitnessStudioValidators.validateFitnessStudioExists(id);

    const fitnessStudio = await FitnessStudioModel.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true,
      }
    );

    return fitnessStudio;
  }

  /**
   * Deletes a fitness studio by its ID.
   * @param {string} id - The fitness studio ID.
   * @returns {Promise<Object>} - The deleted fitness studio.
   */
  async deleteFitnessStudioById(id) {
    const fitnessStudio =
      await FitnessStudioValidators.validateFitnessStudioExists(id);

    await UserFitnessStudioModel.deleteMany({ fitnessStudio: id });

    await FitnessStudioModel.findByIdAndDelete(id);

    return fitnessStudio;
  }

  /**
   * Retrieves all fitness studios.
   * @returns {Promise<Array>} - The list of fitness studios.
   */
  async getAllFitnessStudios() {
    const fitnessStudios = await FitnessStudioModel.find();

    FitnessStudioValidators.validateFitnessStudiosNotEmpty(fitnessStudios);

    return fitnessStudios;
  }

  /**
   * Validates the fitness studio data.
   * @param {Object} data - The fitness studio data.
   */
  _validateFitnessStudioData(data) {
    if (data.studioName) {
      FitnessStudioValidators.validateStudioName(data.studioName);
    }
    if (data.address) {
      FitnessStudioValidators.validateAddress(data.address);
    }
    if (data.email) {
      FitnessStudioValidators.validateEmail(data.email);
    }
  }
}

module.exports = new FitnessStudioService();
