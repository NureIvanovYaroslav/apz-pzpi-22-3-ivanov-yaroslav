const { Schema, model } = require("mongoose");

const Notification = new Schema({
  type: { type: String, required: true },
  content: { type: String, required: true },
  notificationDate: { type: Date, required: true, default: Date.now },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = model("Notification", Notification);
