const TrainingModel = require("../models/Training");
const DeviceModel = require("../models/Device");

class AnalyticsService {
  /**
   * Calculates the calories burned during a training session.
   * @param {string} trainingId - The ID of the training session.
   * @returns {Promise<Object|null>} - The calculated calories or null if training not found.
   */
  async calculateCalories(trainingId) {
    const result = await this._getTrainingWithUser(trainingId);
    if (!result) return null;
    const { training, user } = result;

    let calories;
    if (training.type === "walk" || training.type === "run") {
      calories = this._calculateCaloriesBySteps(training, user);
    } else {
      calories = this._calculateCaloriesByHeartRate(training, user);
    }

    await this._createRecommendations(user, training, calories);
    return calories;
  }

  /**
   * Calculates calories burned based on heart rate data.
   * @param {Object} training - The training session data.
   * @param {Object} user - The user data.
   * @returns {Object} - The calculated calories and related data.
   */
  _calculateCaloriesByHeartRate(training, user) {
    const startTime = new Date(training.startTime).getTime();
    const endTime = new Date(training.endTime).getTime();
    const duration = Math.floor((endTime - startTime) / 60000);

    let totalHeartRate = 0;
    for (const data of training.trainingDatas) {
      totalHeartRate += data.heartRate;
    }
    const averageHeartRate = training.trainingDatas.length
      ? totalHeartRate / training.trainingDatas.length
      : 0;

    const { age, sex } = this._getUserAgeAndSex(user);
    const weight = user.weight;
    let formula = "";
    let caloriesBurned = 0;

    if (sex === "male") {
      formula = `CB = (T * (0.6309 * H + 0.1988 * W + 0.2017 * A - 55.0969)) / 4.184`;
      caloriesBurned =
        (duration *
          (0.6309 * averageHeartRate +
            0.1988 * weight +
            0.2017 * age -
            55.0969)) /
        4.184;
    } else if (sex === "female") {
      formula = `CB = (T * (0.4472 * H - 0.1263 * W + 0.074 * A - 20.4022)) / 4.184`;
      caloriesBurned =
        (duration *
          (0.4472 * averageHeartRate -
            0.1263 * weight +
            0.074 * age -
            20.4022)) /
        4.184;
    }

    return {
      CB: caloriesBurned,
      T: duration,
      H: averageHeartRate,
      A: age,
      W: weight,
      sex,
      formula,
    };
  }

  /**
   * Calculates calories burned based on step data.
   * @param {Object} training - The training session data.
   * @param {Object} user - The user data.
   * @returns {Object} - The calculated calories and related data.
   */
  _calculateCaloriesBySteps(training, user) {
    let totalSteps = 0;
    for (const data of training.trainingDatas) {
      totalSteps += data.steps;
    }

    const heightMeters = user.height / 100;
    const stride = heightMeters * 0.414;
    const distance = stride * totalSteps;

    let speed, MET;
    if (training.type === "walk") {
      speed = 0.9;
      MET = 2.8;
    } else if (training.type === "run") {
      speed = 1.79;
      MET = 5;
    }

    const time = distance / speed;
    const weight = user.weight;
    const formula = `calories = (time * MET * 3.5 * weight) / (200 * 60)`;
    const calories = (time * MET * 3.5 * weight) / (200 * 60);

    return {
      calories,
      totalSteps,
      height: user.height,
      time,
      MET,
      weight,
      formula,
    };
  }

  /**
   * Calculates step statistics for a user.
   * @param {Object} user - The user data.
   * @returns {Promise<Object|null>} - The calculated step statistics or null if no trainings found.
   */
  async _calculateStepStatistics(user) {
    const trainings = await TrainingModel.find({
      device: user.device,
    }).populate("trainingDatas");
    if (!trainings.length) return null;

    let totalSteps = 0;
    const stepsArray = [];
    for (const training of trainings) {
      let trainingSteps = 0;
      for (const data of training.trainingDatas) {
        trainingSteps += data.steps;
      }
      totalSteps += trainingSteps;
      stepsArray.push(trainingSteps);
    }
    const averageSteps = totalSteps / trainings.length;
    const stepStandardDeviation = this._calculateStandardDeviation(
      stepsArray,
      averageSteps
    );
    const coefficientOfVariation = this._calculateCoefficientOfVariation(
      stepStandardDeviation,
      averageSteps
    );

    return {
      averageSteps,
      stepStandardDeviation,
      coefficientOfVariation,
      totalSteps,
      trainingsLength: trainings.length,
    };
  }

  /**
   * Calculates calorie statistics for a user.
   * @param {Object} user - The user data.
   * @returns {Promise<Object|null>} - The calculated calorie statistics or null if no trainings found.
   */
  async _calculateCaloriesStatistics(user) {
    const trainings = await TrainingModel.find({
      device: user.device,
    }).populate("trainingDatas");
    if (!trainings.length) return null;

    let totalCalories = 0;
    const caloriesArray = [];
    for (const training of trainings) {
      const calories = this._calculateCalories(training, user);
      totalCalories += calories.CB || calories.calories;
      caloriesArray.push(calories.CB || calories.calories);
    }

    const averageCalories = totalCalories / trainings.length;
    const calorieStandardDeviation = this._calculateStandardDeviation(
      caloriesArray,
      averageCalories
    );
    const coefficientOfVariation = this._calculateCoefficientOfVariation(
      calorieStandardDeviation,
      averageCalories
    );

    return {
      averageCalories,
      calorieStandardDeviation,
      coefficientOfVariation,
      totalCalories,
      trainingsAmount: trainings.length,
    };
  }

  /**
   * Calculates calories burned during a training session.
   * @param {Object} training - The training session data.
   * @param {Object} user - The user data.
   * @returns {Object} - The calculated calories and related data.
   */
  _calculateCalories(training, user) {
    if (training.type === "walk" || training.type === "run") {
      return this._calculateCaloriesBySteps(training, user);
    }
    return this._calculateCaloriesByHeartRate(training, user);
  }

  /**
   * Calculates the standard deviation of an array of values.
   * @param {Array<number>} values - The array of values.
   * @param {number} mean - The mean of the values.
   * @returns {number} - The calculated standard deviation.
   */
  _calculateStandardDeviation(values, mean) {
    let variance = 0;
    for (const value of values) {
      variance += Math.pow(value - mean, 2);
    }
    variance /= values.length;
    return Math.sqrt(variance);
  }

  /**
   * Calculates the coefficient of variation.
   * @param {number} standardDeviation - The standard deviation.
   * @param {number} mean - The mean of the values.
   * @returns {number} - The calculated coefficient of variation.
   */
  _calculateCoefficientOfVariation(standardDeviation, mean) {
    return mean ? (standardDeviation / mean) * 100 : 0;
  }

  /**
   * Creates recommendations based on training and user data.
   * @param {Object} user - The user data.
   * @param {Object} training - The training session data.
   * @param {Object} calories - The calculated calories data.
   */
  async _createRecommendations(user, training, calories) {
    const stepStats = await this._calculateStepStatistics(user);
    const calorieStats = await this._calculateCaloriesStatistics(user);
    if (!stepStats || !calorieStats) return;

    let currentSteps = 0;
    for (const data of training.trainingDatas) {
      currentSteps += data.steps;
    }

    let message = "";
    if (currentSteps > stepStats.averageSteps) {
      message = `Today you walked more than usual, good job`;
    } else {
      message = `Today you walked less than usual, don't lose your progression`;
    }

    if (calories.CB || calories.calories > calorieStats.averageCalories) {
      message += `\nYou burned more calories than usual in this workout, good job`;
    } else {
      message += `\nYou burned fewer calories than usual in this workout, try harder`;
    }

    await this._checkLastTrainingDate(user);
    await this._analyzeHeartRate(user, training);
  }

  /**
   * Checks the date of the last training session.
   * @param {Object} user - The user data.
   */
  async _checkLastTrainingDate(user) {
    const lastTraining = await TrainingModel.findOne({
      device: user.device,
    }).sort({ endTime: -1 });
    if (!lastTraining) return;

    const lastTrainingDate = new Date(lastTraining.endTime).getTime();
    const currentDate = new Date().getTime();
    const diffTime = Math.abs(currentDate - lastTrainingDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      const message = `You haven't done any sports for ${diffDays} days, come back - physical activity is very useful`;
    }
  }

  /**
   * Analyzes the heart rate data during a training session.
   * @param {Object} user - The user data.
   * @param {Object} training - The training session data.
   */
  async _analyzeHeartRate(user, training) {
    const { age, sex } = this._getUserAgeAndSex(user);
    let maxHeartRate;
    let formula = "";

    if (sex === "male") {
      maxHeartRate = 214 - 0.8 * age;
      formula = `maxHeartRate = 214 - 0.8 * age`;
    } else if (sex === "female") {
      maxHeartRate = 209 - 0.9 * age;
      formula = `maxHeartRate = 209 - 0.9 * age`;
    }

    const heartRates = training.trainingDatas.map((data) => data.heartRate);
    if (!heartRates.length) return;

    const maxHeartRateDuringTraining = Math.max(...heartRates);
    const minHeartRateDuringTraining = Math.min(...heartRates);

    let message = "";
    if (maxHeartRateDuringTraining > maxHeartRate) {
      message = `During this training your heart rate was very high, you should take a break`;
    } else if (maxHeartRateDuringTraining > 0.85 * maxHeartRate) {
      message = `During this training your heart rate was high, try not to overexert yourself`;
    } else if (minHeartRateDuringTraining < 0.5 * maxHeartRate) {
      message = `During this training your heart rate was low, look out for your health`;
    } else {
      message = `During this training your heart rate was normal, keep it up`;
    }
  }

  /**
   * Provides step recommendations based on training data.
   * @param {string} trainingId - The ID of the training session.
   * @returns {Promise<Object>} - The step recommendations and related data.
   */
  async getStepRecommendations(trainingId) {
    const result = await this._getTrainingWithUser(trainingId);
    if (!result) return { message: "Training not found" };
    const { training, user } = result;

    const stepStats = await this._calculateStepStatistics(user);
    if (!stepStats)
      return { message: "Not enough data to calculate statistics" };

    let currentSteps = 0;
    for (const data of training.trainingDatas) {
      currentSteps += data.steps;
    }

    let message = "";
    if (currentSteps > stepStats.averageSteps) {
      message = `You walked more than in average, good job`;
    } else {
      message = `You walked less than in average, don't lose your progression`;
    }

    return {
      message,
      indicators: {
        currentSteps,
        averageSteps: stepStats.averageSteps,
      },
    };
  }

  /**
   * Provides calorie recommendations based on training data.
   * @param {string} trainingId - The ID of the training session.
   * @returns {Promise<Object>} - The calorie recommendations and related data.
   */
  async getCaloriesRecommendations(trainingId) {
    const result = await this._getTrainingWithUser(trainingId);
    if (!result) return { message: "Training not found" };
    const { training, user } = result;

    const calorieStats = await this._calculateCaloriesStatistics(user);
    if (!calorieStats)
      return { message: "Not enough data to calculate statistics" };

    const calories = await this.calculateCalories(trainingId);
    if (!calories) return { message: "Unable to calculate calories" };

    let message = "";
    if (calories.CB || calories.calories > calorieStats.averageCalories) {
      message = `You burned more calories than usual in this workout, good job`;
    } else {
      message = `You burned fewer calories than usual in this workout, try harder`;
    }

    return {
      message,
      indicators: {
        calories: calories.CB || calories.calories,
        averageCalories: calorieStats.averageCalories,
      },
      parameters: calories,
    };
  }

  /**
   * Provides heart rate recommendations based on training data.
   * @param {string} trainingId - The ID of the training session.
   * @returns {Promise<Object>} - The heart rate recommendations and related data.
   */
  async getHeartRateRecommendations(trainingId) {
    const result = await this._getTrainingWithUser(trainingId);
    if (!result) return { message: "Training not found" };
    const { training, user } = result;

    const { age, sex } = this._getUserAgeAndSex(user);
    let maxHeartRate;
    let formula = "";

    if (sex === "male") {
      maxHeartRate = 214 - 0.8 * age;
      formula = `maxHeartRate = 214 - 0.8 * age`;
    } else if (sex === "female") {
      maxHeartRate = 209 - 0.9 * age;
      formula = `maxHeartRate = 209 - 0.9 * age`;
    }

    const heartRates = training.trainingDatas.map((data) => data.heartRate);
    if (!heartRates.length) return { message: "No heart rate data available" };

    const maxHeartRateDuringTraining = Math.max(...heartRates);
    const minHeartRateDuringTraining = Math.min(...heartRates);

    let message = "";
    if (maxHeartRateDuringTraining > maxHeartRate) {
      message = `During this training your heart rate was very high, you should take a break`;
    } else if (maxHeartRateDuringTraining > 0.85 * maxHeartRate) {
      message = `During this training your heart rate was high, try not to overexert yourself`;
    } else if (minHeartRateDuringTraining < 0.5 * maxHeartRate) {
      message = `During this training your heart rate was low, look out for your health`;
    } else {
      message = `During this training your heart rate was normal, keep it up`;
    }

    return {
      message,
      formula,
      indicators: {
        age,
        maxHeartRate,
        maxHeartRateDuringTraining,
        minHeartRateDuringTraining,
        acceptableRange: {
          lower: 0.5 * maxHeartRate,
          upper: 0.85 * maxHeartRate,
        },
      },
    };
  }

  /**
   * Retrieves training data along with user data.
   * @param {string} trainingId - The ID of the training session.
   * @returns {Promise<Object|null>} - The training and user data or null if not found.
   */
  async _getTrainingWithUser(trainingId) {
    const training = await TrainingModel.findById(trainingId).populate(
      "trainingDatas"
    );
    if (!training) return null;

    const device = await DeviceModel.findById(training.device).populate("user");
    if (!device) return null;

    return { training, user: device.user, device };
  }

  /**
   * Retrieves the age and sex of a user.
   * @param {Object} user - The user data.
   * @returns {Object} - The age and sex of the user.
   */
  _getUserAgeAndSex(user) {
    const birthDate = new Date(user.birthDate).getTime();
    const ageDifMs = Date.now() - birthDate;
    const age = new Date(ageDifMs).getUTCFullYear() - 1970;
    const sex = user.sex.toLowerCase();
    return { age, sex };
  }
}

module.exports = new AnalyticsService();
