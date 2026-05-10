const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  registrationOpen: { type: Boolean, default: true },
  siteName: { type: String, default: 'مسجدي' },
  siteDescription: String,
  footerText: String,
  logoUrl: String
});

module.exports = mongoose.model('Settings', settingsSchema);
