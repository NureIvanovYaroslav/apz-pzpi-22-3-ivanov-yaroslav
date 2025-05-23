const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

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
}

module.exports = new AdminService();
