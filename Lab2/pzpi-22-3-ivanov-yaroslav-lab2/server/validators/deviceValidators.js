const ApiError = require("../errors/apiError");
const DeviceModel = require("../models/Device");
const UserModel = require("../models/User");

class DeviceValidators {
  static validateStatus(status) {
    if (!status || typeof status !== "string" || status.trim() === "") {
      throw ApiError.BadRequest(
        "Status is required and must be a non-empty string"
      );
    }
  }

  static validateSendDataFrequency(sendDataFrequency) {
    if (
      !sendDataFrequency ||
      typeof sendDataFrequency !== "number" ||
      sendDataFrequency <= 0
    ) {
      throw ApiError.BadRequest(
        "Send data frequency is required and must be a number greater than zero"
      );
    }
  }

  static async validateDeviceExists(id) {
    const device = await DeviceModel.findById(id);
    if (!device) {
      throw ApiError.NotFound("Device not found");
    }
    return device;
  }

  static async validateUserExists(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.NotFound("User not found");
    }
    return user;
  }

  static async validateUserHasNoDevice(user) {
    if (user.device) {
      throw ApiError.BadRequest("User already has a device");
    }
  }

  static validateDevicesNotEmpty(devices) {
    if (devices.length === 0) {
      throw ApiError.NotFound("Devices not found");
    }
  }
}

module.exports = DeviceValidators;
