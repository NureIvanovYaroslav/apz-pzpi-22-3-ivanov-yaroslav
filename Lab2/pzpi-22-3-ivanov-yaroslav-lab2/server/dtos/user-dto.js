module.exports = class UserDto {
  id;
  password;
  email;
  name;
  birthDate;
  height;
  weight;
  country;
  sex;
  device;
  roles;
  notifications;
  goals;
  userFitnessStudios;

  constructor(model) {
    this.id = model._id;
    this.password = model.password;
    this.email = model.email;
    this.name = model.name;
    this.birthDate = model.birthDate;
    this.height = model.height;
    this.weight = model.weight;
    this.country = model.country;
    this.sex = model.sex;
    this.device = model.device;
    this.roles = model.roles;
    this.notifications = model.notifications;
    this.goals = model.goals;
    this.userFitnessStudios = model.userFitnessStudios;
  }
};
