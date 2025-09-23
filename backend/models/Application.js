const mongoose = require('mongoose');
const applicationSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  job_id: String
}, { timestamps: true });
module.exports = mongoose.model('Application', applicationSchema);
