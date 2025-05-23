const { Schema, model } = require("mongoose");

const Training = new Schema({
  type: { type: String, required: true },
  startTime: { type: Date, required: true, default: Date.now },
  endTime: { type: Date, required: true, default: Date.now },
  device: { type: Schema.Types.ObjectId, ref: "Device", required: true },
  userFitnessStudio: {
    type: Schema.Types.ObjectId,
    ref: "UserFitnessStudio",
    required: true,
  },
  trainingDatas: [
    { type: Schema.Types.ObjectId, ref: "TrainingData", default: [] },
  ],
});

module.exports = model("Training", Training);
