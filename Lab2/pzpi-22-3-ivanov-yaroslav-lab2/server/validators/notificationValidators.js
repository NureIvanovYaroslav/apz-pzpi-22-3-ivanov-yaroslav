const ApiError = require("../errors/apiError");
const NotificationModel = require("../models/Notification");
const UserModel = require("../models/User");

class NotificationValidators {
  static validateType(type) {
    if (!type || typeof type !== "string" || type.trim() === "") {
      throw ApiError.BadRequest("Type is required must be a non-empty string");
    }
  }

  static validateContent(content) {
    if (!content || typeof content !== "string" || content.trim() === "") {
      throw ApiError.BadRequest(
        "Content is required and must be a non-empty string"
      );
    }
  }

  static validateNotificationDate(notificationDate) {
    if (!notificationDate || isNaN(Date.parse(notificationDate))) {
      throw ApiError.BadRequest(
        "Notification date is required and must be a valid date"
      );
    }
  }

  static async validateNotificationExists(id) {
    const notification = await NotificationModel.findById(id);
    if (!notification) {
      throw ApiError.NotFound("Notification not found");
    }
    return notification;
  }

  static async validateUserExists(userId) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw ApiError.NotFound("User not found");
    }
    return user;
  }

  static validateNotificationsNotEmpty(notifications) {
    if (!notifications || notifications.length === 0) {
      throw ApiError.NotFound("Notifications not found");
    }
  }
}

module.exports = NotificationValidators;
