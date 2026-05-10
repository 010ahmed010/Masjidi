const mongoose = require('mongoose');

const occasionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Occasion', occasionSchema);
