const mongoose = require("mongoose");
const DoctorSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  job: { type: String, required: true },
  phonenumber: { type: String, required: true, minlength: 10 },
  password: { type: String, required: true, minlength: 6 },
  age: { type: Number, required: true, min: 18 },
  profilepic: { type: String, required: true },
  waitingappoiments: [],
  appoiments: [],
  location: {type:String},
  Isonline: {type: Boolean},
  appoimentPrise: {type: Number},
  about: {type:String},
});

module.exports = mongoose.model("Doctor", DoctorSchema);
