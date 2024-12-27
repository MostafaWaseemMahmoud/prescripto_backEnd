const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  illness: { type: String, required: true },
  phonenumber: { type: String, required: true, minlength: 10 },
  password: { type: String, required: true, minlength: 6 },
  profilepic: { type: String, required: true },
});

module.exports = mongoose.model("Patient", PatientSchema);
