const { validationResult } = require("express-validator");
const notificationService = require("../services/NotificationService");
const ApiError = require("../errors/apiError");
const NotificationDto = require("../dtos/notification-dto");

class NotificationController {
  async createNotification(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return next(ApiError.BadRequest("Validation error", errors.array()));
      }

      const notification = await notificationService.createNotification(
        req.body
      );
      const notificationDto = new NotificationDto(notification);

      return res.status(200).json(notificationDto);
    } catch (e) {
      next(e);
    }
  }

  async getNotificationById(req, res, next) {
    try {
      const { id } = req.params;
      const notification = await notificationService.getNotificationById(id);
      const notificationDto = new NotificationDto(notification);

      return res.status(200).json(notificationDto);
    } catch (e) {
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

      return res.status(200).json(notificationDto);
    } catch (e) {
      next(e);
    }
  }

  async deleteNotificationById(req, res, next) {
    try {
      const { id } = req.params;
      await notificationService.deleteNotificationById(id);

      return res
        .status(200)
        .json({ message: "Notification successfully deleted" });
    } catch (e) {
      next(e);
    }
  }

  async getAllNotifications(req, res, next) {
    try {
      const notifications = await notificationService.getAllNotifications();
      const notificationsDto = notifications.map(
        (notification) => new NotificationDto(notification)
      );

      return res.status(200).json(notificationsDto);
    } catch (e) {
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

      return res.status(200).json(notificationsDto);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new NotificationController();
