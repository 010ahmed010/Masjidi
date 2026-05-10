const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  phone: String,
  whatsapp: String,
  guardianName: String,
  guardianPhone: String,
  assignedClass: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
  assignedTeacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', studentSchema);
