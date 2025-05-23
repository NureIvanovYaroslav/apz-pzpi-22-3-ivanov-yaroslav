const { Schema, model } = require("mongoose");

const UserFitnessStudio = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  fitnessStudio: {
    type: Schema.Types.ObjectId,
    ref: "FitnessStudio",
    required: true,
  },
  trainings: [{ type: Schema.Types.ObjectId, ref: "Training", default: [] }],
});

module.exports = model("UserFitnessStudio", UserFitnessStudio);
