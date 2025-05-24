const fs = require("fs");
const path = require("path");
const ApiError = require("../errors/apiError");

const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}
function getLogFileName() {
  const date = new Date().toISOString().slice(0, 10);
  return path.join(logsDir, `server-${date}.log`);
}

module.exports = function (err, req, res, next) {
  const logLine = `[${new Date().toISOString()}] ERROR: ${err.message}\n`;
  fs.appendFile(getLogFileName(), logLine, () => {});
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: "Unexpected error" });
};
