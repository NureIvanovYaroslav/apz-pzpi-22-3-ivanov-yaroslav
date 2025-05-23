const jwt = require("jsonwebtoken");
const TokenModel = require("../models/Token");

class TokenService {
  /**
   * Generates access and refresh tokens.
   * @param {Object} payload - The payload to sign.
   * @returns {Object} - The generated access and refresh tokens.
   */
  generateToken(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
      expiresIn: "30d",
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  /**
   * Saves the refresh token for a user.
   * @param {string} userId - The user ID.
   * @param {string} refreshToken - The refresh token.
   * @returns {Promise<Object>} - The saved token data.
   */
  async saveToken(userId, refreshToken) {
    const tokenData = await TokenModel.findOne({ user: userId });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;

      return tokenData.save();
    }

    const token = await TokenModel.create({ user: userId, refreshToken });

    return token;
  }

  /**
   * Removes a refresh token.
   * @param {string} refreshToken - The refresh token.
   * @returns {Promise<Object>} - The removed token data.
   */
  async removeToken(refreshToken) {
    const tokenData = await TokenModel.deleteOne({ refreshToken });

    return tokenData;
  }

  /**
   * Validates an access token.
   * @param {string} token - The access token.
   * @returns {Object|null} - The decoded user data or null if invalid.
   */
  validateAccessToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

      return userData;
    } catch (e) {
      return null;
    }
  }

  /**
   * Validates a refresh token.
   * @param {string} token - The refresh token.
   * @returns {Object|null} - The decoded user data or null if invalid.
   */
  validateRefreshToken(token) {
    try {
      const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

      return userData;
    } catch (e) {
      return null;
    }
  }

  /**
   * Finds a refresh token in the database.
   * @param {string} refreshToken - The refresh token.
   * @returns {Promise<Object|null>} - The token data or null if not found.
   */
  async findToken(refreshToken) {
    const tokenData = await TokenModel.findOne({ refreshToken });
    return tokenData;
  }
}

module.exports = new TokenService();
