const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFilePath = path.join(logsDir, "actions.log");

function readLogs() {
  if (!fs.existsSync(logFilePath)) return [];
  const content = fs.readFileSync(logFilePath, "utf-8");
  if (!content) return [];
  try {
    return JSON.parse(content);
  } catch {
    return [];
  }
}

function writeLogs(logs) {
  fs.writeFileSync(logFilePath, JSON.stringify(logs, null, 2));
}

class ActionLogService {
  /**
   * Log a user/server action.
   * @param {Object} params
   * @param {string} params.userId - User ID (or 'system' for system actions)
   * @param {string} params.description - Description of the action
   * @param {boolean} params.success - Was the action successful
   */
  log({ userId, description, success }) {
    const logs = readLogs();
    const entry = {
      id: uuidv4(),
      date: new Date().toISOString(),
      userId,
      description,
      success,
    };
    logs.push(entry);
    writeLogs(logs);
  }

  /**
   * Get all logs as array.
   * @returns {Array}
   */
  getAllLogs() {
    return readLogs();
  }

  /**
   * Delete all logs (clear file, keep file).
   */
  deleteAllLogs() {
    writeLogs([]);
    return { deleted: "all" };
  }

  /**
   * Delete logs by date (YYYY-MM-DD).
   * @param {string} date
   */
  deleteLogsByDate(date) {
    const logs = readLogs();
    const before = logs.length;
    const filtered = logs.filter(
      (log) => !log.date.startsWith(date)
    );
    writeLogs(filtered);
    return { deleted: before - filtered.length };
  }
}

module.exports = new ActionLogService();