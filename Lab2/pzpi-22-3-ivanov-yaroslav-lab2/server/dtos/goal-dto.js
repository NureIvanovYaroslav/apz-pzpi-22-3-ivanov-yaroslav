module.exports = class GoalDto {
  id;
  status;
  content;
  startDate;
  finishDate;
  user;

  constructor(model) {
    this.id = model._id;
    this.status = model.status;
    this.content = model.content;
    this.startDate = model.startDate;
    this.finishDate = model.finishDate;
    this.user = model.user;
  }
};
