const DeviceModel = require("../models/Device");
const TrainingModel = require("../models/Training");
const DeviceValidators = require("../validators/deviceValidators");

class DeviceService {
  /**
   * Creates a new device.
   * @param {Object} data - The device data.
   * @returns {Promise<Object>} - The created device.
   */
  async createDevice(data) {
    this._validateDeviceData(data);

    const user = await DeviceValidators.validateUserExists(data.user);
    await DeviceValidators.validateUserHasNoDevice(user);

    const device = await DeviceModel.create(data);

    user.device = device._id;
    await user.save();

    return device;
  }

  /**
   * Retrieves a device by its ID.
   * @param {string} id - The device ID.
   * @returns {Promise<Object>} - The device data.
   */
  async getDeviceById(id) {
    const device = await DeviceValidators.validateDeviceExists(id);

    return device;
  }

  /**
   * Updates a device by its ID.
   * @param {string} id - The device ID.
   * @param {Object} updatedFields - The fields to update.
   * @returns {Promise<Object>} - The updated device.
   */
  async updateDeviceById(id, updatedFields) {
    this._validateDeviceData(updatedFields);

    await DeviceValidators.validateDeviceExists(id);

    const device = await DeviceModel.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    return device;
  }

  /**
   * Deletes a device by its ID.
   * @param {string} id - The device ID.
   * @returns {Promise<Object>} - The deleted device.
   */
  async deleteDeviceById(id) {
    const device = await DeviceValidators.validateDeviceExists(id);

    const user = await DeviceValidators.validateUserExists(device.user);
    user.device = null;
    await user.save();

    await TrainingModel.deleteMany({ device: device._id });

    await DeviceModel.findByIdAndDelete(id);

    return device;
  }

  /**
   * Retrieves all devices.
   * @returns {Promise<Array>} - The list of devices.
   */
  async getAllDevices() {
    const devices = await DeviceModel.find();

    DeviceValidators.validateDevicesNotEmpty(devices);

    return devices;
  }

  /**
   * Validates the device data.
   * @param {Object} data - The device data.
   */
  _validateDeviceData(data) {
    if (data.status) {
      DeviceValidators.validateStatus(data.status);
    }
    if (data.sendDataFrequency) {
      DeviceValidators.validateSendDataFrequency(data.sendDataFrequency);
    }
  }
}

module.exports = new DeviceService();
