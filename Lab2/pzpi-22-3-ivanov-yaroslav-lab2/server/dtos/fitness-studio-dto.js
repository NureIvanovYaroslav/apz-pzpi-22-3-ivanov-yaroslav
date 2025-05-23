module.exports = class FitnessStudioDto {
  id;
  studioName;
  address;
  email;
  userFitnessStudios;

  constructor(model) {
    this.id = model._id;
    this.studioName = model.studioName;
    this.address = model.address;
    this.email = model.email;
    this.userFitnessStudios = model.userFitnessStudios;
  }
};
