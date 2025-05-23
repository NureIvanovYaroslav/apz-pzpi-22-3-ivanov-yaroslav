const { Schema, model } = require("mongoose");

const FitnessStudio = new Schema({
  studioName: { type: String, required: true },
  address: { type: String, required: true },
  email: { type: String, required: true },
  userFitnessStudios: [
    { type: Schema.Types.ObjectId, ref: "UserFitnessStudio", default: [] },
  ],
});

module.exports = model("FitnessStudio", FitnessStudio);
