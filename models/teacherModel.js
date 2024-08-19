const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  name:String,
  email:String,
  password:String
},
{
  timestamps:true
});

const teacherModel = mongoose.model("teachers", teacherSchema);
module.exports = teacherModel;
