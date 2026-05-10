const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  whatsapp: String,
  phone: String,
  email: String,
  masjidImage: String,
  mapsIframe: String,
  description: String,
  address: String,
  facebook: String,
  instagram: String,
  twitter: String
});

module.exports = mongoose.model('Contact', contactSchema);
