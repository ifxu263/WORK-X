const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
  title: String,
  company: String,
  category: String,
  location: String,
  address: String,
  type: String,
  salary: String,
  contact: String,
  desc: String,
  companyImg: String
}, { timestamps: true });

module.exports = mongoose.model("Job", JobSchema);
