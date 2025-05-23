module.exports = class NotificationDto {
  id;
  type;
  content;
  notificationDate;
  user;

  constructor(model) {
    this.id = model._id;
    this.type = model.type;
    this.content = model.content;
    this.notificationDate = model.notificationDate;
    this.user = model.user;
  }
};
