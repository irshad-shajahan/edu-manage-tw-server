const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name:String,
  subject:String,
  marks:Number
},
{
  timestamps:true
});

const studentModel = mongoose.model("students", studentSchema);
module.exports = studentModel;
