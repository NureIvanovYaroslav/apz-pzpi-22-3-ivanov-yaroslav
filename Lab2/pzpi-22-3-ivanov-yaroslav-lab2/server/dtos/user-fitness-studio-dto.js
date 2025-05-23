module.exports = class UserDto {
  id;
  user;
  fitnessStudio;
  trainings;

  constructor(model) {
    this.id = model._id;
    this.user = model.user;
    this.fitnessStudio = model.fitnessStudio;
    this.trainings = model.trainings;
  }
};
