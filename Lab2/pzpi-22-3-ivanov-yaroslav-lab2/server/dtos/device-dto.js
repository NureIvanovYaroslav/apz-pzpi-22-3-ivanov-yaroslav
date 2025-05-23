module.exports = class DeviceDto {
  id;
  status;
  sendDataFrequency;
  user;
  trainings;

  constructor(model) {
    this.id = model._id;
    this.status = model.status;
    this.sendDataFrequency = model.sendDataFrequency;
    this.user = model.user;
    this.trainings = model.trainings;
  }
};
