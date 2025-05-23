const { Schema, model } = require("mongoose");

const User = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  birthDate: { type: Date, required: true },
  height: { type: Number, required: true },
  weight: { type: Number, required: true },
  country: { type: String, required: true },
  sex: { type: String, required: true },
  device: { type: Schema.Types.ObjectId, ref: "Device", required: false },
  roles: [{ type: String, ref: "Role", required: true, default: [] }],
  notifications: [
    { type: Schema.Types.ObjectId, ref: "Notification", default: [] },
  ],
  goals: [{ type: Schema.Types.ObjectId, ref: "Goal", default: [] }],
  userFitnessStudios: [
    { type: Schema.Types.ObjectId, ref: "UserFitnessStudio", default: [] },
  ],
});

module.exports = model("User", User);
