const { validationResult } = require("express-validator");
const authService = require("../services/AuthService");
const actionLogService = require("../services/LogService");
const ApiError = require("../errors/apiError");

class authController {
  async registration(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        actionLogService.log({
          userId: req.body.email || "unknown",
          description: "User registration (validation error)",
          success: false,
        });
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const { email, password } = req.body;
      const userData = await authService.registration(email, password);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      actionLogService.log({
        userId: email,
        description: "User registration",
        success: true,
      });

      return res.status(200).json(userData);
    } catch (e) {
      actionLogService.log({
        userId: req.body.email || "unknown",
        description: "User registration",
        success: false,
      });
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const { accessToken, refreshToken } = await authService.login(
        email,
        password
      );

      res.cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      actionLogService.log({
        userId: email,
        description: "User login",
        success: true,
      });

      return res.status(200).json({ accessToken, refreshToken });
    } catch (e) {
      actionLogService.log({
        userId: req.body.email || "unknown",
        description: "User login",
        success: false,
      });
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        actionLogService.log({
          userId: req.user?.id || "unknown",
          description: "User logout (not logged in)",
          success: false,
        });
        return res.status(400).json({ message: "User is not logged in" });
      }

      await authService.logout(refreshToken);

      res.clearCookie("refreshToken");

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "User logout",
        success: true,
      });

      return res.status(200).json({ message: "User successfully logged out" });
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "User logout",
        success: false,
      });
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        actionLogService.log({
          userId: req.user?.id || "unknown",
          description: "Token refresh (not logged in)",
          success: false,
        });
        return res.status(401).json({ message: "User is not logged in" });
      }

      const tokens = await authService.refresh(refreshToken);

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Token refresh",
        success: true,
      });

      return res.status(200).json(tokens);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Token refresh",
        success: false,
      });
      next(e);
    }
  }
}

module.exports = new authController();
