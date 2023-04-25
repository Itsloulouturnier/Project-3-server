const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
email: String,
password: String,

},
{
  timestamps: true
}

);

module.exports = model("User", userSchema);
