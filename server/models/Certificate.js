const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  title: { type: String, required: true },
  description: String,
  issuedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['issued', 'delivered', 'pending'], default: 'pending' },
  notes: String
});

module.exports = mongoose.model('Certificate', certificateSchema);
