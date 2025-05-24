const { validationResult } = require("express-validator");
const notificationService = require("../services/NotificationService");
const actionLogService = require("../services/LogService");
const ApiError = require("../errors/apiError");
const NotificationDto = require("../dtos/notification-dto");

class NotificationController {
  async createNotification(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        actionLogService.log({
          userId: req.user?.id || "unknown",
          description: "Create notification (validation error)",
          success: false,
        });
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const notification = await notificationService.createNotification(
        req.body
      );
      const notificationDto = new NotificationDto(notification);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create notification",
        success: true,
      });

      return res.status(200).json(notificationDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Create notification",
        success: false,
      });
      next(e);
    }
  }

  async getNotificationById(req, res, next) {
    try {
      const { id } = req.params;
      const notification = await notificationService.getNotificationById(id);
      const notificationDto = new NotificationDto(notification);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get notification by id: ${id}`,
        success: true,
      });

      return res.status(200).json(notificationDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get notification by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async updateNotificationById(req, res, next) {
    try {
      const { id } = req.params;
      const notification = await notificationService.updateNotificationById(
        id,
        req.body
      );
      const notificationDto = new NotificationDto(notification);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update notification by id: ${id}`,
        success: true,
      });

      return res.status(200).json(notificationDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Update notification by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async deleteNotificationById(req, res, next) {
    try {
      const { id } = req.params;
      await notificationService.deleteNotificationById(id);

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete notification by id: ${id}`,
        success: true,
      });

      return res
        .status(200)
        .json({ message: "Notification successfully deleted" });
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Delete notification by id: ${req.params.id}`,
        success: false,
      });
      next(e);
    }
  }

  async getAllNotifications(req, res, next) {
    try {
      const notifications = await notificationService.getAllNotifications();
      const notificationsDto = notifications.map(
        (notification) => new NotificationDto(notification)
      );

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all notifications",
        success: true,
      });

      return res.status(200).json(notificationsDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: "Get all notifications",
        success: false,
      });
      next(e);
    }
  }

  async getNotificationsByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const notifications = await notificationService.getNotificationsByUserId(
        userId
      );
      const notificationsDto = notifications.map(
        (notification) => new NotificationDto(notification)
      );

      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get notifications by user id: ${userId}`,
        success: true,
      });

      return res.status(200).json(notificationsDto);
    } catch (e) {
      actionLogService.log({
        userId: req.user?.id || "unknown",
        description: `Get notifications by user id: ${req.params.userId}`,
        success: false,
      });
      next(e);
    }
  }
}

module.exports = new NotificationController();
