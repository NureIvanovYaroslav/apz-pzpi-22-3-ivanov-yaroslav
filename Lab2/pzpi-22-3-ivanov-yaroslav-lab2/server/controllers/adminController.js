const adminService = require("../services/AdminService");
const path = require("path");

class AdminController {
  async backupDatabase(req, res, next) {
    try {
      const result = await adminService.backupDatabase();
      res.status(result.success ? 200 : 500).json(result);
    } catch (e) {
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
      res.status(result.success ? 200 : 500).json(result);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new AdminController();
