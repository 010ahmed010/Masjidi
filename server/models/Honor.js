const mongoose = require('mongoose');

const honorSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  reason: String,
  weekStart: Date,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  adminNote: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Honor', honorSchema);
