const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // direct save here (no auth, demo only)
  avatar: String
}, { timestamps: true }); // timestamps optional but useful

module.exports = mongoose.model("User", UserSchema);
