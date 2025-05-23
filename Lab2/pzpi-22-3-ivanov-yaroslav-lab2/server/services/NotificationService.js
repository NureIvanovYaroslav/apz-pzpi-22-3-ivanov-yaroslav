const NotificationModel = require("../models/Notification");
const UserModel = require("../models/User");
const NotificationValidators = require("../validators/notificationValidators");

class NotificationService {
  /**
   * Creates a new notification.
   * @param {Object} data - The notification data.
   * @returns {Promise<Object>} - The created notification.
   */
  async createNotification(data) {
    this._validateNotificationlData(data);

    const user = await NotificationValidators.validateUserExists(data.user);

    const notification = await NotificationModel.create(data);

    user.notifications.push(notification._id);
    await user.save();

    return notification;
  }

  /**
   * Retrieves a notification by its ID.
   * @param {string} id - The notification ID.
   * @returns {Promise<Object>} - The notification data.
   */
  async getNotificationById(id) {
    const notification =
      await NotificationValidators.validateNotificationExists(id);

    return notification;
  }

  /**
   * Updates a notification by its ID.
   * @param {string} id - The notification ID.
   * @param {Object} updatedFields - The fields to update.
   * @returns {Promise<Object>} - The updated notification.
   */
  async updateNotificationById(id, updatedFields) {
    this._validateNotificationlData(updatedFields);

    await NotificationValidators.validateNotificationExists(id);

    const notification = await NotificationModel.findByIdAndUpdate(
      id,
      updatedFields,
      {
        new: true,
      }
    );

    return notification;
  }

  /**
   * Deletes a notification by its ID.
   * @param {string} id - The notification ID.
   * @returns {Promise<Object>} - The deleted notification.
   */
  async deleteNotificationById(id) {
    const notification =
      await NotificationValidators.validateNotificationExists(id);

    const user = await NotificationValidators.validateUserExists(
      notification.user
    );
    user.notifications.pull(notification._id);
    await user.save();

    await NotificationModel.findByIdAndDelete(id);

    return notification;
  }

  /**
   * Retrieves all notifications.
   * @returns {Promise<Array>} - The list of notifications.
   */
  async getAllNotifications() {
    const notifications = await NotificationModel.find();

    NotificationValidators.validateNotificationsNotEmpty(notifications);

    return notifications;
  }

  /**
   * Retrieves notifications by user ID.
   * @param {string} userId - The user ID.
   * @returns {Promise<Array>} - The list of notifications for the user.
   */
  async getNotificationsByUserId(userId) {
    await NotificationValidators.validateUserExists(userId);

    const user = await UserModel.findById(userId).populate("notifications");

    const notifications = user.notifications;

    NotificationValidators.validateNotificationsNotEmpty(notifications);

    return notifications;
  }

  /**
   * Validates the notification data.
   * @param {Object} data - The notification data.
   */
  _validateNotificationlData(data) {
    if (data.type) {
      NotificationValidators.validateType(data.type);
    }
    if (data.content) {
      NotificationValidators.validateContent(data.content);
    }
    if (data.notificationDate) {
      NotificationValidators.validateNotificationDate(data.notificationDate);
    }
  }
}

module.exports = new NotificationService();
