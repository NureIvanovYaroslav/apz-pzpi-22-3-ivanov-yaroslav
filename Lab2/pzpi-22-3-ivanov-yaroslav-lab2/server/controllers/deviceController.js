const { validationResult } = require("express-validator");
const deviceService = require("../services/DeviceService");
const actionLogService = require("../services/LogService");
const ApiError = require("../errors/apiError");
const DeviceDto = require("../dtos/device-dto");

class DeviceController {
  async createDevice(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        actionLogService.log({
          userId: req.user?.id || "unknown",
          description: "Create device (validation error)",
          success: false,
        });
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const device = await deviceService.createDevice(req.body);
      const deviceDto = new DeviceDto(device);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create device",
        success: true,
      });

      return res.status(200).json(deviceDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create device",
        success: false,
      });
      next(e);
    }
  }

  async getDeviceById(req, res, next) {
    try {
      const { id } = req.params;
      const device = await deviceService.getDeviceById(id);
      const deviceDto = new DeviceDto(device);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get device by id: ${id}`,
        success: true,
      });

      return res.status(200).json(deviceDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get device by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async updateDeviceById(req, res, next) {
    try {
      const { id } = req.params;
      const device = await deviceService.updateDeviceById(id, req.body);
      const deviceDto = new DeviceDto(device);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update device by id: ${id}`,
        success: true,
      });

      return res.status(200).json(deviceDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update device by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async deleteDeviceById(req, res, next) {
    try {
      const { id } = req.params;
      await deviceService.deleteDeviceById(id);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete device by id: ${id}`,
        success: true,
      });

      return res.status(200).json({ message: "Device successfully deleted" });
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete device by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async getAllDevices(req, res, next) {
    try {
      const devices = await deviceService.getAllDevices();
      const devicesDto = devices.map((device) => new DeviceDto(device));

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all devices",
        success: true,
      });

      return res.status(200).json(devicesDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all devices",
        success: false,
      });
      next(e);
    }
  }
}

module.exports = new DeviceController();
