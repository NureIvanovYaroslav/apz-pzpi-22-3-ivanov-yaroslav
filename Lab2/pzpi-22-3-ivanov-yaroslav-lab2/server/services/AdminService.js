const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const configPath = path.join(__dirname, "../server-config.json");
const logsDir = path.join(__dirname, "../logs");
const logService = require("./LogService");
const mongoose = require("mongoose");

class AdminService {
  constructor() {
    this.rootDir = path.resolve(__dirname, "../../");
    this.backupDir = path.join(this.rootDir, "backups");
    this.mongoUri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@arkpz.scpri.mongodb.net/?retryWrites=true&w=majority&appName=arkpz`;
  }

  /**
   * Creates a backup of the MongoDB database.
   * @returns {Promise<Object>} - A promise that resolves to an object indicating success or failure.
   */
  async backupDatabase() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const backupPath = path.join(this.backupDir, `backup-${timestamp}`);

    return new Promise((resolve) => {
      const command = `mongodump --uri "${this.mongoUri}" --out ${backupPath}`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve({ success: false, message: stderr });
        } else {
          resolve({
            success: true,
            message: `Backup created at ${backupPath}`,
          });
        }
      });
    });
  }

  /**
   * Restores the MongoDB database from a backup.
   * @param {string} filePath - The path to the backup directory.
   * @returns {Promise<Object>} - A promise that resolves to an object indicating success or failure.
   */
  async restoreDatabase(filePath) {
    if (!filePath || !fs.existsSync(filePath)) {
      return {
        success: false,
        message: `Invalid or missing filePath: ${filePath}`,
      };
    }

    return new Promise((resolve) => {
      const command = `mongorestore --uri "${this.mongoUri}" --dir ${filePath} --drop`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          resolve({ success: false, message: stderr });
        } else {
          resolve({ success: true, message: "Database restored successfully" });
        }
      });
    });
  }

  /**
   * Returns the current status of the server process.
   * @returns {Object} - An object containing status, uptime, memory usage, and timestamp.
   */
  getServerStatus() {
    return {
      status: "OK",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Returns the current status of the MongoDB connection.
   * @returns {Object} - An object containing status, state, host, and database name.
   */
  async getDatabaseStatus() {
    try {
      const state = mongoose.connection.readyState;
      return {
        status: state === 1 ? "CONNECTED" : "DISCONNECTED",
        state,
        host: mongoose.connection.host,
        name: mongoose.connection.name,
      };
    } catch (e) {
      return { status: "ERROR", error: e.message };
    }
  }

  /**
   * Returns the current server configuration, including secrets and token refresh interval.
   * @returns {Object} - The server configuration object.
   */
  getServerConfig() {
    let config = {};
    if (fs.existsSync(configPath)) {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    }
    config.JWT_ACCESS_SECRET =
      config.JWT_ACCESS_SECRET || process.env.JWT_ACCESS_SECRET;
    config.JWT_REFRESH_SECRET =
      config.JWT_REFRESH_SECRET || process.env.JWT_REFRESH_SECRET;
    config.TOKEN_REFRESH_INTERVAL =
      config.TOKEN_REFRESH_INTERVAL ||
      process.env.TOKEN_REFRESH_INTERVAL ||
      3600;
    return config;
  }

  /**
   * Updates the server configuration and environment variables.
   * @param {Object} newConfig - The new configuration object.
   * @returns {Object} - The updated server configuration.
   */
  setServerConfig(newConfig) {
    if (newConfig.JWT_ACCESS_SECRET)
      process.env.JWT_ACCESS_SECRET = newConfig.JWT_ACCESS_SECRET;
    if (newConfig.JWT_REFRESH_SECRET)
      process.env.JWT_REFRESH_SECRET = newConfig.JWT_REFRESH_SECRET;
    if (newConfig.TOKEN_REFRESH_INTERVAL)
      process.env.TOKEN_REFRESH_INTERVAL = newConfig.TOKEN_REFRESH_INTERVAL;

    const configToSave = { ...newConfig };
    fs.writeFileSync(configPath, JSON.stringify(configToSave, null, 2));
    return this.getServerConfig();
  }

  /**
   * Returns all logs as array of objects.
   * @returns {Array}
   */
  getLogs() {
    return logService.getAllLogs();
  }

  /**
   * Deletes all logs (clears the log file).
   * @returns {Object}
   */
  deleteAllLogs() {
    return logService.deleteAllLogs();
  }

  /**
   * Deletes logs for a specific date (YYYY-MM-DD).
   * @param {string} date
   * @returns {Object}
   */
  deleteLogsByDate(date) {
    return logService.deleteLogsByDate(date);
  }
}

module.exports = new AdminService();
