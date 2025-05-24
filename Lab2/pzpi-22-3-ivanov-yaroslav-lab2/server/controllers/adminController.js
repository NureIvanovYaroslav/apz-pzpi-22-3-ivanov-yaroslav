const adminService = require("../services/AdminService");
const actionLogService = require("../services/LogService");
const path = require("path");

class AdminController {
  async backupDatabase(req, res, next) {
    try {
      const result = await adminService.backupDatabase();
      actionLogService.log({
        userId: req.user?.id || "system",
        description: "Backup database",
        success: result.success,
      });
      res.status(result.success ? 200 : 500).json(result);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "system",
        description: "Backup database",
        success: false,
      });
      next(e);
    }
  }

  async restoreDatabase(req, res, next) {
    try {
      const backupPath = path.resolve(
        adminService.backupDir,
        req.body.backupName
      );
      const result = await adminService.restoreDatabase(backupPath);
      actionLogService.log({
        userId: req.user?.id || "system",
        description: `Restore database from backup: ${req.body.backupName}`,
        success: result.success,
      });
      res.status(result.success ? 200 : 500).json(result);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "system",
        description: `Restore database from backup: ${req.body.backupName}`,
        success: false,
      });
      next(e);
    }
  }

  async getDatabaseStatus(req, res, next) {
    try {
      const status = await adminService.getDatabaseStatus();
      actionLogService.log({
        userId: req.user?.id || "system",
        description: "Get database status",
        success: true,
      });
      res.json(status);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "system",
        description: "Get database status",
        success: false,
      });
      next(e);
    }
  }

  async getServerStatus(req, res, next) {
    try {
      const status = adminService.getServerStatus();
      actionLogService.log({
        userId: req.user?.id || "system",
        description: "Get server status",
        success: true,
      });
      res.json(status);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "system",
        description: "Get server status",
        success: false,
      });
      next(e);
    }
  }

  async getServerConfig(req, res, next) {
    try {
      const config = adminService.getServerConfig();
      actionLogService.log({
        userId: req.user?.id || "system",
        description: "Get server config",
        success: true,
      });
      res.json(config);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "system",
        description: "Get server config",
        success: false,
      });
      next(e);
    }
  }

  async setServerConfig(req, res, next) {
    try {
      const config = adminService.setServerConfig(req.body);
      actionLogService.log({
        userId: req.user?.id || "system",
        description: "Set server config",
        success: true,
      });
      res.json({ message: "Config updated", config });
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "system",
        description: "Set server config",
        success: false,
      });
      next(e);
    }
  }

  async getLogs(req, res, next) {
    try {
      const logs = adminService.getLogs();
      actionLogService.log({
        userId: req.user?.id || "system",
        description: "Get server logs",
        success: true,
      });
      res.json(logs);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "system",
        description: "Get server logs",
        success: false,
      });
      next(e);
    }
  }

  async deleteAllLogs(req, res, next) {
    try {
      const result = adminService.deleteAllLogs();
      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  async deleteLogsByDate(req, res, next) {
    try {
      const { date } = req.query;
      if (!date) {
        return res
          .status(400)
          .json({ message: "Date query parameter is required" });
      }
      const result = adminService.deleteLogsByDate(date);
      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AdminController();
