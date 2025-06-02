const TrainingDataModel = require("../models/TrainingData");
const TrainingModel = require("../models/Training");
const TrainingDataValidators = require("../validators/trainingDataValidators");

class TrainingDataService {
  /**
   * Creates a new training data entry.
   * @param {Object} data - The training data.
   * @returns {Promise<Object>} - The created training data.
   */
  async createTrainingData(data) {
    this._validateTrainingDataData(data);

    const training = await TrainingDataValidators.validateTrainingExists(
      data.training
    );

    const trainingData = await TrainingDataModel.create(data);

    training.trainingDatas.push(trainingData._id);
    await training.save();

    return trainingData;
  }

  /**
   * Retrieves training data by its ID.
   * @param {string} id - The training data ID.
   * @returns {Promise<Object>} - The training data.
   */
  async getTrainingDataById(id) {
    const trainingData =
      await TrainingDataValidators.validateTrainingDataExists(id);

    return trainingData;
  }

  /**
   * Updates training data by its ID.
   * @param {string} id - The training data ID.
   * @param {Object} updatedFields - The fields to update.
   * @returns {Promise<Object>} - The updated training data.
   */
  async updateTrainingDataById(id, updatedFields) {
    this._validateTrainingDataData(updatedFields);

    await TrainingDataValidators.validateTrainingDataExists(id);

    const trainingData = await TrainingDataModel.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true,
      }
    );

    return trainingData;
  }

  /**
   * Deletes training data by its ID.
   * @param {string} id - The training data ID.
   * @returns {Promise<Object>} - The deleted training data.
   */
  async deleteTrainingDataById(id) {
    const trainingData =
      await TrainingDataValidators.validateTrainingDataExists(id);

    const training = await TrainingDataValidators.validateTrainingExists(
      trainingData.training
    );

    training.trainingDatas.pull(trainingData._id);
    await training.save();

    await TrainingDataModel.findByIdAndDelete(id);

    return trainingData;
  }

  /**
   * Retrieves all training data entries.
   * @returns {Promise<Array>} - The list of training data.
   */
  async getAllTrainingData() {
    const trainingDatas = await TrainingDataModel.find();

    TrainingDataValidators.validateTrainingDataNotEmpty(trainingDatas);

    return trainingDatas;
  }

  /**
   * Retrieves training data by training ID.
   * @param {string} trainingId - The training ID.
   * @returns {Promise<Array>} - The list of training data for the training.
   */
  async getTrainingDataByTrainingId(trainingId) {
    const training = await TrainingModel.findById(trainingId);
    if (!training) {
      throw new Error("Training not found");
    }

    const trainingDatas = await TrainingDataModel.find({
      training: trainingId,
    });

    return trainingDatas;
  }

  /**
   * Validates the training data.
   * @param {Object} data - The training data.
   */
  _validateTrainingDataData(data) {
    if (data.sendingTime) {
      TrainingDataValidators.validateSendingTime(data.sendingTime);
    }
    if (data.heartRate) {
      TrainingDataValidators.validateHeartRate(data.heartRate);
    }
    if (data.steps) {
      TrainingDataValidators.validateSteps(data.steps);
    }
  }
}

module.exports = new TrainingDataService();
