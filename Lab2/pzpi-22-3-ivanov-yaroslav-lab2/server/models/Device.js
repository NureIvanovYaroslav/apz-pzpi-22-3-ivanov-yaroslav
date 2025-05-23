const { Schema, model } = require("mongoose");

const Device = new Schema({
  status: { type: String, required: true, default: "disabled" },
  sendDataFrequency: { type: Number, required: true, default: 60 },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  trainings: [{ type: Schema.Types.ObjectId, ref: "Training", default: [] }],
});

module.exports = model("Device", Device);
