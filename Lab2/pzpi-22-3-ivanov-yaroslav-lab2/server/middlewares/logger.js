const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logFilePath = path.join(logsDir, "actions.log");

function logger(req, res, next) {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    const logLine = `[${new Date().toISOString()}] ${req.method} ${
      req.originalUrl
    } ${res.statusCode} ${duration}ms\n`;
    fs.appendFile(logFilePath, logLine, (err) => {
      if (err) console.error("Failed to write log:", err);
    });
  });
  next();
}

module.exports = logger;
