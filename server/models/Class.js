const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: '' }
}, { _id: false });

const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  courses: { type: [courseSchema], default: [] },
  courseName: String,
  courseImage: String,
  teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
  description: String,
  showOnHomePage: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Class', classSchema);
