const fs = require("fs");
const path = require("path");

const logsDir = path.join(process.cwd(), "logs");
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);

const getLogFilePath = () => path.join(logsDir, new Date().toISOString().slice(0, 10) + ".log");

const errorLogger = (req, res) => {
  if (res.statusCode >= 400) {
    const line = `DATE: ${new Date().toISOString().slice(0, 10)} STATUS: ${res.statusCode} MESSAGE: ${res.statusMessage || "Error"}\n`;
    fs.appendFileSync(getLogFilePath(), line);
  }
};

module.exports = errorLogger;