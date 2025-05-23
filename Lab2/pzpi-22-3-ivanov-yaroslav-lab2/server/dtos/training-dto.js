module.exports = class TrainingDto {
  id;
  type;
  startTime;
  endTime;
  device;
  userFitnessStudio;
  trainingDatas;

  constructor(model) {
    this.id = model._id;
    this.type = model.type;
    this.startTime = model.startTime;
    this.endTime = model.endTime;
    this.device = model.device;
    this.userFitnessStudio = model.userFitnessStudio;
    this.trainingDatas = model.trainingDatas;
  }
};
