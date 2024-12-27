const mongoose = require("mongoose");

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, minlength: 3 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  profilepic: { type: String, required: true },
  doctors:{type:Array,required: true},
});

module.exports = mongoose.model("Admin", AdminSchema);