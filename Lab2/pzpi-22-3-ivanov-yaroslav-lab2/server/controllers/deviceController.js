const { validationResult } = require("express-validator");
const deviceService = require("../services/DeviceService");
const ApiError = require("../errors/apiError");
const DeviceDto = require("../dtos/device-dto");

class DeviceController {
  async createDevice(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const device = await deviceService.createDevice(req.body);
      const deviceDto = new DeviceDto(device);

      return res.status(200).json(deviceDto);
    } catch (e) {
      next(e);
    }
  }

  async getDeviceById(req, res, next) {
    try {
      const { id } = req.params;
      const device = await deviceService.getDeviceById(id);
      const deviceDto = new DeviceDto(device);

      return res.status(200).json(deviceDto);
    } catch (e) {
      next(e);
    }
  }

  async updateDeviceById(req, res, next) {
    try {
      const { id } = req.params;
      const device = await deviceService.updateDeviceById(id, req.body);
      const deviceDto = new DeviceDto(device);

      return res.status(200).json(deviceDto);
    } catch (e) {
      next(e);
    }
  }

  async deleteDeviceById(req, res, next) {
    try {
      const { id } = req.params;
      await deviceService.deleteDeviceById(id);

      return res.status(200).json({ message: "Device successfully deleted" });
    } catch (e) {
      next(e);
    }
  }

  async getAllDevices(req, res, next) {
    try {
      const devices = await deviceService.getAllDevices();
      const devicesDto = devices.map((device) => new DeviceDto(device));

      return res.status(200).json(devicesDto);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DeviceController();
