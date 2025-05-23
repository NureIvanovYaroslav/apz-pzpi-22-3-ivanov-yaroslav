module.exports = class RoleDto {
  id;
  value;

  constructor(model) {
    this.id = model._id;
    this.value = model.value;
  }
};
