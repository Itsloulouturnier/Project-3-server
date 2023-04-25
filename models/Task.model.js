const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const taskSchema = new Schema({
  title: String,
  description: String,
  customer: { type: Schema.Types.ObjectId, ref: "Customer" },
});

module.exports = model("Task", taskSchema);
