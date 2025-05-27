const TrainingModel = require("../models/Training");
const DeviceModel = require("../models/Device");
const UserFitnessStudioModel = require("../models/UserFitnessStudio");
const TrainingDataModel = require("../models/TrainingData");
const TrainingValidators = require("../validators/trainingValidators");

class TrainingService {
  /**
   * Creates a new training session.
   * @param {Object} data - The training data.
   * @returns {Promise<Object>} - The created training session.
   */
  async createTraining(data) {
    this._validateTrainingData(data);

    const device = await TrainingValidators.validateDeviceExists(data.device);
    const userFitnessStudio =
      await TrainingValidators.validateUserFitnessStudioExists(
        data.userFitnessStudio
      );

    const training = await TrainingModel.create(data);

    device.trainings.push(training._id);
    await device.save();

    userFitnessStudio.trainings.push(training._id);
    await userFitnessStudio.save();

    return training;
  }

  /**
   * Retrieves a training session by its ID.
   * @param {string} id - The training ID.
   * @returns {Promise<Object>} - The training session data.
   */
  async getTrainingById(id) {
    const training = await TrainingValidators.validateTrainingExists(id);

    return training;
  }

  /**
   * Updates a training session by its ID.
   * @param {string} id - The training ID.
   * @param {Object} updatedFields - The fields to update.
   * @returns {Promise<Object>} - The updated training session.
   */
  async updateTrainingById(id, updatedFields) {
    this._validateTrainingData(updatedFields);

    await TrainingValidators.validateTrainingExists(id);

    const training = await TrainingModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    return training;
  }

  /**
   * Deletes a training session by its ID.
   * @param {string} id - The training ID.
   * @returns {Promise<Object>} - The deleted training session.
   */
  async deleteTrainingById(id) {
    const training = await TrainingValidators.validateTrainingExists(id);

    const device = await TrainingValidators.validateDeviceExists(
      training.device
    );
    device.trainings.pull(training._id);
    await device.save();

    const userFitnessStudio =
      await TrainingValidators.validateUserFitnessStudioExists(
        training.userFitnessStudio
      );
    userFitnessStudio.trainings.pull(training._id);
    await userFitnessStudio.save();

    await TrainingDataModel.deleteMany({ training: training._id });

    await TrainingModel.findByIdAndDelete(id);

    return training;
  }

  /**
   * Retrieves all training sessions.
   * @returns {Promise<Array>} - The list of training sessions.
   */
  async getAllTrainings() {
    const trainings = await TrainingModel.find();

    TrainingValidators.validateTrainingsNotEmpty(trainings);

    return trainings;
  }

  /**
   * Retrieves training sessions by user fitness studio ID.
   * @param {string} userFitnessStudioId - The user fitness studio ID.
   * @returns {Promise<Array>} - The list of training sessions for the user fitness studio.
   */
  async getTrainingsByUserFitnessStudioId(userFitnessStudioId) {
    await TrainingValidators.validateUserFitnessStudioExists(
      userFitnessStudioId
    );

    const userFitnessStudio = await UserFitnessStudioModel.findById(
      userFitnessStudioId
    ).populate("trainings");

    const trainings = userFitnessStudio.trainings;

    TrainingValidators.validateTrainingsNotEmpty(trainings);

    return trainings;
  }

  /**
   * Retrieves training sessions by device ID.
   * @param {string} deviceId - The device ID.
   * @returns {Promise<Array>} - The list of training sessions for the device.
   */
  async getTrainingsByDeviceId(deviceId) {
    await TrainingValidators.validateDeviceExists(deviceId);

    const trainings = await TrainingModel.find({ device: deviceId });

    TrainingValidators.validateTrainingsNotEmpty(trainings);

    return trainings;
  }

  /**
   * Validates the training data.
   * @param {Object} data - The training data.
   */
  _validateTrainingData(data) {
    if (data.type) {
      TrainingValidators.validateType(data.type);
    }
    if (data.startDate && data.finishDate) {
      TrainingValidators.validateDates(data.startTime, data.endTime);
    }
  }
}

module.exports = new TrainingService();
