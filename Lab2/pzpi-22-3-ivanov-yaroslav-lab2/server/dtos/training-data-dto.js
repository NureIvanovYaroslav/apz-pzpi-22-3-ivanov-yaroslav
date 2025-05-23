module.exports = class TrainingDataDto {
  id;
  sendingTime;
  heartRate;
  steps;
  training;

  constructor(model) {
    this.id = model._id;
    this.sendingTime = model.sendingTime;
    this.heartRate = model.heartRate;
    this.steps = model.steps;
    this.training = model.training;
  }
};
