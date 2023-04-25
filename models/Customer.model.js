const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const customerSchema = new Schema({
  title: String,
  description: String,
  firstname: String, 
  lastname: String,
  companyname: String,
  phonenumber: String,
  city: String, 
  balance: String,
  tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
},
{
  timestamps: true
}

);

module.exports = model("Customer", customerSchema);
