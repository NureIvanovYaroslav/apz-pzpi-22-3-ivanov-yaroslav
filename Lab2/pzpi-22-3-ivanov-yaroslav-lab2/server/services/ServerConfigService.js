const fs = require("fs");
const path = require("path");

const configPath = path.join(__dirname, "../server-config.json");

class ServerConfigService {
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
}

module.exports = new ServerConfigService();
