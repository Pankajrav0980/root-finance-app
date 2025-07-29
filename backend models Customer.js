const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  loan: Number,
  interest: Number,
  months: Number,
  startDate: Date,
  emi: Number,
  overdue: Number,
}, { timestamps: true });

module.exports = mongoose.model('Customer', CustomerSchema);