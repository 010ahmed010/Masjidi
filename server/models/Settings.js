const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  registrationOpen: { type: Boolean, default: true },
  siteName: { type: String, default: '' },
  siteDescription: String,
  footerText: String
});

module.exports = mongoose.model('Settings', settingsSchema);
